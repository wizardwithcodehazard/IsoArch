import os
import base64
import json
import asyncio
import difflib
import itertools
from io import BytesIO
from typing import List, Dict, Any
from PIL import Image, ImageEnhance
import fitz  # PyMuPDF

from google import genai
from google.genai import types
from groq import AsyncGroq
from pydantic import ValidationError

from models import MTOResult, MTOItem, DrawingMeta, MTOSummary

# We will instantiate clients per-request if BYOK keys are provided,
# otherwise we fall back to the env vars.

def get_gemini_clients(custom_keys: List[str] = None):
    if custom_keys and len(custom_keys) > 0:
        return [genai.Client(api_key=k.strip()) for k in custom_keys if k.strip()]
    
    keys_str = os.environ.get("GEMINI_API_KEYS") or os.environ.get("GEMINI_API_KEY", "")
    keys = [k.strip() for k in keys_str.split(",") if k.strip()]
    return [genai.Client(api_key=k) for k in keys] if keys else []

def get_groq_client(custom_key: str = None):
    key = custom_key or os.environ.get("GROQ_API_KEY")
    if key:
        return AsyncGroq(api_key=key.strip())
    return None


def preprocess_image(file_bytes: bytes) -> bytes:
    """
    Applies classic Convolutional/CV preprocessing (Sharpening and Contrast)
    to the image to make faded tags and isometric symbols pop out for the LLM.
    Also ensures the image is compressed if it approaches Groq's 4MB base64 limit.
    """
    try:
        # Load image into PIL
        image = Image.open(BytesIO(file_bytes))
        
        # Convert to RGB (in case it's RGBA/PNG)
        if image.mode in ('RGBA', 'P'):
            image = image.convert('RGB')
            
        # Enhance Contrast (helps separate faint lines from the background)
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.5)
        
        # Apply Convolutional Sharpening Kernel (helps make text and symbols crisp)
        sharpener = ImageEnhance.Sharpness(image)
        image = sharpener.enhance(2.0)
        
        # Compress and save back to bytes
        # We use a quality setting that keeps it crisp but reduces byte size
        output_io = BytesIO()
        image.save(output_io, format="JPEG", quality=85, optimize=True)
        processed_bytes = output_io.getvalue()
        
        if len(processed_bytes) > 3.8 * 1024 * 1024:
            print("WARNING: Image is still close to 4MB after processing.")
            
        return processed_bytes
        
    except Exception as e:
        print(f"Image preprocessing failed: {e}. Falling back to original bytes.")
        return file_bytes


def remove_title_from_schema(schema: Any) -> Any:
    """Recursively removes 'title' keys from a JSON schema."""
    if isinstance(schema, dict):
        return {k: remove_title_from_schema(v) for k, v in schema.items() if k != "title"}
    elif isinstance(schema, list):
        return [remove_title_from_schema(v) for v in schema]
    return schema

async def extract_gemini(image_bytes: bytes, model_name: str, thinking_level: str = "MINIMAL", custom_keys: List[str] = None) -> Dict:
    """
    Calls the Google Gemini API to extract the MTO.
    """
    clients = get_gemini_clients(custom_keys)
    if not clients:
        return {}
        
    prompt = f"""
    Analyze the provided image. Your task is to extract the Material Take-Off (MTO) if it is a valid piping isometric drawing.
    
    RULES:
    1. BOM TABLE PRIORITY: If there is a Bill of Materials (BOM) or Material List printed in the corner of the drawing, you MUST read the quantities, sizes, and descriptions from that table FIRST. Do not guess dimensions from the sketch if a table exists.
    2. ZERO-GUESSING FOR SKETCHES: If the image is just a sketch or lacks any recognizable piping symbols, return an empty "items" array.
    3. EXTRACT CLEAR SYMBOLS: If it IS a valid isometric, extract every pipe, fitting, flange, and valve.
    4. WELD COUNTING: Explicitly look for and count Field Welds (FW) and add them to the summary tally.
    5. BONUS: For every detected item, try to provide its bounding_box as [ymin, xmin, ymax, xmax] using normalized coordinates (0.0 to 1.0).
    6. Return strictly valid JSON matching this schema structure:
    {json.dumps(MTOResult.model_json_schema(), indent=2)}
    """
    
    max_retries = max(3, len(clients))
    client_cycle = itertools.cycle(clients)
    
    for attempt in range(max_retries):
        client = next(client_cycle)
        try:
            # We use run_in_executor because genai client might be sync
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=model_name,
                contents=[
                    types.Content(
                        role="user",
                        parts=[
                            types.Part.from_text(text=prompt),
                            types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg") # Assuming JPEG for now
                        ]
                    )
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            
            # Parse JSON output
            return json.loads(response.text)
        except Exception as e:
            print(f"Error in Gemini extraction ({model_name}) attempt {attempt+1}/{max_retries}: {e}")
            if attempt == max_retries - 1:
                return {}
            await asyncio.sleep(2) # Backoff before next key


# Removed mathematical_merge in favor of Groq Semantic Judge Pattern


async def validate_with_groq(image_bytes: bytes, json_a: Dict, json_b: Dict, custom_key: str = None) -> Dict:
    """
    Acts as the Ultimate Judge. Takes the multimodal image and the JSON extractions
    from the two Gemini models.
    """
    client = get_groq_client(custom_key)
    if not client:
        return json_a or json_b
        
    # Base64 encode the image (must be under 4MB)
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = f"""
    You are the Senior Piping Engineering Judge. 
    You are given two Material Take-Off (MTO) JSON outputs extracted by two junior AI vision models.
    Your job is to SEMANTICALLY MERGE them, resolve any disagreements by visually verifying the image, and output the final validated JSON.
    
    MODEL A OUTPUT:
    {json.dumps(json_a, indent=2)}
    
    MODEL B OUTPUT:
    {json.dumps(json_b, indent=2)}
    
    CRITICAL INSTRUCTIONS:
    1. SEMANTIC MERGE: If Model A says "Check Valve" and Model B says "Swing Check Valve 150#", they are the same thing. Merge them into a single row. Do not blindly duplicate items.
    2. CONFLICT RESOLUTION: If the models disagree on quantity, dimension, or existence of an item, you MUST look at the image to verify who is right. 
    3. CONFIDENCE SCORING: 
       - If both models agreed perfectly, assign confidence = 0.99.
       - If they disagreed and you had to resolve it by checking the image, assign confidence = 0.50 to 0.70.
    4. BOUNDING BOXES FOR CONFLICTS: If you manually verify an item, generate a bounding_box [ymin, xmin, ymax, xmax]. Preserve existing ones.
    5. DOMAIN PHYSICS: If you finalized the flanges, ensure Flanged joints have EXACTLY 1 Gasket and 1 Bolt Set.
    6. WELD COUNTING: Ensure Field Welds (FW) are accurately tallied in the summary if present.
    7. ZERO-GUESSING: If both models returned empty item arrays, return an empty array. Do not invent parts.
    8. MODEL FAILURE: If one of the model outputs is empty or has no items (e.g. due to rate limits or API failure), you MUST visually verify all items from the other active model against the image. Generate normalized bounding_boxes [ymin, xmin, ymax, xmax] for these verified items and assign confidence scores between 0.70 and 0.85 (do not output 0.99 for them, as they were only extracted by a single model).
    
    Return the final merged JSON matching the schema.
    """
    
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        final_json_str = chat_completion.choices[0].message.content
        return json.loads(final_json_str)
        
    except Exception as e:
        print(f"Error in Groq validation: {e}")
        # Fall back to whichever model returned more data defensively
        items_a = json_a.get("items", []) if isinstance(json_a, dict) else []
        items_b = json_b.get("items", []) if isinstance(json_b, dict) else []
        return json_a if len(items_a) >= len(items_b) else json_b


async def run_extraction_pipeline(file_bytes: bytes, gemini_keys: List[str] = None, groq_key: str = None) -> MTOResult:
    """
    The orchestrator function called by FastAPI.
    """
    # 0. Convert PDF to Image if necessary
    if file_bytes.startswith(b"%PDF"):
        try:
            print("PDF detected. Converting first page to image...")
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            page = doc.load_page(0)  # Load first page
            # Render at 300 DPI for high quality
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            file_bytes = pix.tobytes("jpeg")
            doc.close()
        except Exception as e:
            print(f"Failed to convert PDF: {e}")
            raise ValueError("Unable to process PDF document.")

    # 1. Preprocess
    clean_bytes = preprocess_image(file_bytes)
    
    # 2. Extract in parallel (Gemini 3.5 Flash & 3.1 Flash Lite)
    print("Starting parallel extraction...")
    json_35, json_31 = await asyncio.gather(
        extract_gemini(clean_bytes, "gemini-3.5-flash", "medium", gemini_keys),
        extract_gemini(clean_bytes, "gemini-3.1-flash-lite", "MINIMAL", gemini_keys)
    )
    
    # Fallback to single if one failed, or mock if both failed
    if not json_35 and not json_31:
        raise ValueError("Both vision models failed to return data.")
    
    # 3. Semantic Merge & Domain Validation (Judge Pattern via Groq)
    print("Running Agentic Semantic Merge and Validation via Groq Llama-4-scout...")
    final_json = await validate_with_groq(clean_bytes, json_35 or {}, json_31 or {}, groq_key)
    
    # Inject the base64 processed image back so frontend doesn't struggle with PDFs
    final_json["processed_image_base64"] = f"data:image/jpeg;base64,{base64.b64encode(clean_bytes).decode('utf-8')}"
    
    # 4. Pydantic hard-validation
    try:
        validated_result = MTOResult(**final_json)
        return validated_result
    except ValidationError as e:
        print(f"Pydantic Validation Error: {e}")
        # If Pydantic fails on final output, try to gracefully fallback to one of the raw outputs
        return MTOResult(**(json_35 or json_31))
