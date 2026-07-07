# ArchPipeline: AI-Driven Piping MTO Extraction

ArchPipeline is a production-grade, end-to-end AI architecture designed to extract precise Material Take-Offs (MTO) from complex piping isometric drawings. Built as an engineering assessment for PathNovo, it solves the core issue of generative AI: **hallucinations in deterministic engineering contexts.**

---

## 🏗️ System Architecture

The architecture utilizes a multi-model ensemble ("Agentic Judge Pattern") combined with deterministic Computer Vision layers to ensure ISO-standard piping physics and absolute truthfulness.

```mermaid
graph TD
    %% Styling
    classDef client fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef api fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef cv fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef ai fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef judge fill:#ffebee,stroke:#c62828,stroke-width:2px;
    classDef output fill:#eceff1,stroke:#455a64,stroke-width:2px;

    %% Frontend Boundary
    subgraph "Client Layer (Next.js Material-3)"
        UI["User Interface <br> (BYOK Config)"]:::client
        Upload["File Upload <br> (PDF, PNG, JPG)"]:::client
    end

    %% Backend Boundary
    subgraph "API Gateway (FastAPI)"
        Router["POST /api/extract <br> (FormData)"]:::api
        PydanticValidator["Pydantic Schema <br> Validation"]:::api
    end

    %% Computer Vision Pre-Processing
    subgraph "Deterministic Vision Layer"
        PDF["PyMuPDF (fitz) <br> Rasterization Engine"]:::cv
        CNN["Pillow CNN Kernels <br> (Sharpness & Contrast)"]:::cv
    end

    %% Ensemble Execution
    subgraph "Parallel Vision Extraction"
        Gemini35["Gemini 3.5 Flash <br> (Primary)"]:::ai
        Gemini31["Gemini 3.1 Flash Lite <br> (Failover)"]:::ai
    end

    %% Agentic Resolution
    subgraph "Semantic Validation Layer"
        Groq["Groq Llama-4-Scout <br> (Senior Judge)"]:::judge
        DomainRules["Domain Rules Engine <br> (ASME Physics)"]:::judge
    end

    %% Data Flow
    UI --> Upload
    Upload -- "Multipart/Form-Data" --> Router
    Router --> PDF
    PDF -- "JPEG Bytes" --> CNN
    CNN --> Gemini35
    CNN --> Gemini31
    
    Gemini35 -- "Async JSON Extraction" --> Groq
    Gemini31 -- "Async JSON Extraction" --> Groq
    CNN -- "Base64 Image Context" --> Groq
    
    Groq <--> DomainRules
    Groq -- "Semantically Merged JSON" --> PydanticValidator
    PydanticValidator -- "Strict MTOResult Object" --> UI
```

---

## 📈 Evolution of the Pipeline (Our Journey)

Building this pipeline was an iterative process of identifying LLM weaknesses and engineering architectural solutions. Here is exactly how we arrived at the final product:

### 1. The Naive Approach (Where We Started)
Initially, we passed the raw uploaded images straight to a single LLM (Gemini 3.5 Flash) and asked it to return a JSON array. 
*   **The Failure:** It confidently hallucinated items that didn't exist. It couldn't read blurry text. It provided 100% confidence scores even when guessing, and the pipeline crashed when users uploaded PDFs.

### 2. Computer Vision Pre-Processing (Pillow CNN)
We realized vision models struggle heavily with the low-contrast text and thin, faded routing lines typical of scanned isometric drawings. 
*   **The Solution:** Before the LLM ever sees the image, we run it through Python's `Pillow` library using Convolutional Kernels (`ImageEnhance.Sharpness` and `ImageEnhance.Contrast`). This dynamically crisps up the text tags and thickens the piping symbols, drastically improving the LLM's OCR accuracy.
*   **PDF Support:** We also integrated `PyMuPDF` (`fitz`) to intercept PDF uploads, mathematically rasterizing them into 300 DPI high-contrast JPEGs.

### 3. The Tri-Model "Agentic Judge" Pattern (The Final Form)
Even with sharpened images, a single LLM cannot determine its own confidence accurately. We initially tried running two models in parallel and merging them using a Python fuzzy-math script (`difflib`). However, the Python script was "dumb"—it didn't understand that a "Check Valve" and a "Swing Check Valve 150#" were the same physical object, resulting in duplicate BOM rows.

*   **The Ultimate Solution:** We deleted the Python merging logic and introduced **Groq Llama-4-Scout** as the "Senior Judge". 
Now, both Gemini models pass their JSON extractions *along with the original image* directly to Groq. Groq reads both lists, identifies semantic synonyms, visually verifies conflicts in the original image, enforces piping physics (e.g., ensuring flanges have exactly 1 Gasket and 1 Bolt Set), and draws bounding boxes around the items it had to manually verify.

---

## 🛡️ Edge Cases Handled

*   **The "Zero-Guessing" Policy:** If the drawing is just a sketch or routing diagram with no BOM table, the models are strictly prompted to return an empty array rather than hallucinating generic pipes based on lines.
*   **API Rate Limits (429s):** The backend supports **Round-Robin Key Rotation**. If Gemini Key A hits the free-tier limit, it gracefully falls back to Key B. If all Geminis fail, it degrades gracefully to a fallback JSON without crashing the frontend.
*   **"Bring Your Own Key" (BYOK):** The frontend dashboard allows evaluators to input their own API keys directly into the UI to bypass server-side rate limits entirely.

---

## 🚀 The Endgame: Future Architecture (V2)

While this Agentic Pipeline is extremely robust for LLM-based OCR, the ultimate form of this software would move away from LLM raster-guessing entirely. 

If this were deployed at scale, Architecture V2 would involve:
1.  **Raster-to-Vector:** Using tools like `potrace` or OpenCV contour mapping to convert the PDF into SVG mathematical line graphs.
2.  **Graph Neural Networks (GNN):** Parsing the drawing not as pixels, but as a Graph (Nodes = Fittings, Edges = Pipes). This makes routing calculations 100% deterministic and flawless.
3.  **YOLOv8 Symbol Detection:** Instead of relying on Gemini to draw bounding boxes, a specialized Two-Stage Detection Pipeline using YOLOv8 trained specifically on ASME symbols would crop the image into perfect quadrants.
4.  **3D Interactivity:** The vectorized Graph would be fed into a WebGL engine (like Manim or Three.js), allowing engineers to click an interactive 3D pipe and dynamically change its NPS, updating the BOM instantly.

---

## 💻 Local Setup & Execution

### Option A: Local Docker (Recommended)
You can run the entire stack (Frontend + Backend) effortlessly using Docker Compose:
```bash
docker-compose up --build
```
*   The dashboard will be available at `http://localhost:3000`
*   The API will run at `http://localhost:8000`

### Option B: Manual Run
If you prefer running the servers natively without Docker:

**1. Start the Backend API**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**2. Start the Frontend Dashboard**
```bash
cd frontend
npm install
npm run dev
```
