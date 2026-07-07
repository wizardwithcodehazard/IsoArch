import os
import json
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import MTOResult

load_dotenv(override=True)

app = FastAPI(title="ArchPipeline MTO Extraction API")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_mock_mto() -> dict:
    """Returns a valid mock MTO if no API keys are provided."""
    return {
        "drawing_meta": {
            "drawing_no": "ISO-1501-01",
            "revision": "2",
            "line_number": "6\"-P-1501-A1A-IH",
            "nps": "6\"",
            "material_class": "A1A",
            "service": "Process"
        },
        "items": [
            {
                "item_no": 1,
                "category": "PIPE",
                "description": "Pipe, Seamless, BE, ASME B36.10",
                "size_nps": "6\"",
                "schedule_rating": "SCH 40",
                "material_spec": "ASTM A106 Gr.B",
                "end_type": "BW",
                "quantity": 1,
                "unit": "M",
                "length_m": 12.45,
                "confidence": 0.92,
                "remarks": "Mock fallback"
            },
            {
                "item_no": 2,
                "category": "FITTING",
                "description": "Elbow 90 Deg LR, BW, ASME B16.9",
                "size_nps": "6\"",
                "schedule_rating": "SCH 40",
                "material_spec": "ASTM A234 WPB",
                "end_type": "BW",
                "quantity": 4,
                "unit": "EA",
                "length_m": None,
                "confidence": 0.88,
                "remarks": "Mock fallback"
            },
            {
                "item_no": 3,
                "category": "FLANGE",
                "description": "Flange, Weld Neck, Raised Face",
                "size_nps": "6\"",
                "schedule_rating": "CL150",
                "material_spec": "ASTM A105",
                "end_type": "BW",
                "quantity": 2,
                "unit": "EA",
                "length_m": None,
                "confidence": 0.95,
                "remarks": "Mock fallback"
            },
            {
                "item_no": 4,
                "category": "VALVE",
                "description": "Gate Valve, Bolted Bonnet, OS&Y",
                "size_nps": "6\"",
                "schedule_rating": "CL150",
                "material_spec": "ASTM A216 WCB",
                "end_type": "FLGD",
                "quantity": 1,
                "unit": "EA",
                "length_m": None,
                "confidence": 0.99,
                "remarks": "Mock fallback"
            },
            {
                "item_no": 5,
                "category": "GASKET",
                "description": "Spiral Wound Gasket, CG, SS316/Graphite",
                "size_nps": "6\"",
                "schedule_rating": "CL150",
                "material_spec": "ASME B16.20",
                "end_type": "-",
                "quantity": 2,
                "unit": "EA",
                "length_m": None,
                "confidence": 1.0,
                "remarks": "Mock fallback"
            },
            {
                "item_no": 6,
                "category": "BOLT",
                "description": "Stud Bolt with 2 Heavy Hex Nuts",
                "size_nps": "3/4\"",
                "schedule_rating": "-",
                "material_spec": "ASTM A193 B7 / A194 2H",
                "end_type": "-",
                "quantity": 2,
                "unit": "SET",
                "length_m": None,
                "confidence": 1.0,
                "remarks": "Mock fallback"
            }
        ],
        "summary": {
            "total_pipe_length_m": 12.45,
            "fittings": 4,
            "flanges": 2,
            "valves": 1,
            "gaskets": 2,
            "bolt_sets": 2,
            "field_welds": 1
        }
    }


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/mock", response_model=MTOResult)
async def mock_mto():
    """Returns the mock data instantly for dashboard testing."""
    return get_mock_mto()


@app.post("/api/extract", response_model=MTOResult)
async def extract_mto(
    file: UploadFile = File(...),
    gemini_key_1: str = Form(None),
    gemini_key_2: str = Form(None),
    groq_key_custom: str = Form(None)
):
    if not file.content_type in ["image/png", "image/jpeg", "application/pdf"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload PNG, JPG, or PDF.")
    
    # Read the file
    content = await file.read()
    
    # Check size limit (20MB)
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Limit is 20MB.")
    
    # Check for custom keys or fall back to env
    custom_gemini_keys = [k for k in [gemini_key_1, gemini_key_2] if k]
    env_gemini_keys = os.getenv("GEMINI_API_KEYS") or os.getenv("GEMINI_API_KEY")
    gemini_key = custom_gemini_keys[0] if custom_gemini_keys else env_gemini_keys
    
    final_groq_key = groq_key_custom or os.getenv("GROQ_API_KEY")
    
    # Graceful degradation if keys are missing
    if not gemini_key or len(gemini_key) < 20 or "your_gemini" in gemini_key:
        print(f"WARN: API keys not found or invalid, returning mock MTO.")
        return get_mock_mto()
    
    # Connect to the actual pipeline
    from pipeline import run_extraction_pipeline
    try:
        return await run_extraction_pipeline(content, gemini_keys=custom_gemini_keys, groq_key=final_groq_key)
    except Exception as e:
        print(f"Pipeline error: {e}")
        return get_mock_mto()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
