"""
Vercel Serverless API Entry Point
Wraps FastAPI application for Vercel's Python runtime
"""
import os
import sys
from pathlib import Path

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Set environment defaults for serverless (optional dependencies)
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379")
os.environ.setdefault("TAVILY_API_KEY", "")  # Optional for some modes

# Import FastAPI and create a simple app for serverless
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a lightweight FastAPI app for serverless
app = FastAPI(
    title="Mediverse API",
    description="Medical AI Assistant - Serverless",
    version="1.0.0"
)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import services
try:
    from app.services.ai_service import MedicalAIService
    from app.services.medical_validator import MedicalValidator
    from app.services.search_service import MedicalSearchService
    
    ai_service = MedicalAIService()
    validator = MedicalValidator()
    search_service = MedicalSearchService()
    services_available = True
except Exception as e:
    logger.error(f"Failed to load services: {e}")
    services_available = False

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Mediverse API - Serverless",
        "version": "1.0.0",
        "status": "online",
        "services": services_available
    }

# Health endpoint
@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "services": services_available
    }

# Main analyze endpoint
@app.post("/api/v1/analyze")
async def analyze(
    query: str = Form(...),
    mode: str = Form("quick"),
    image: UploadFile = File(None)
):
    """
    Analyze medical queries with AI
    """
    try:
        if not services_available:
            raise HTTPException(status_code=503, detail="AI services not initialized")
        
        # Validate query
        validation = validator.validate_query(query)
        if not validation.get("valid"):
            raise HTTPException(status_code=400, detail=validation.get("message"))
        
        # Process based on mode
        if mode == "image" and image:
            # Image analysis
            contents = await image.read()
            import base64
            from PIL import Image
            from io import BytesIO
            
            img = Image.open(BytesIO(contents))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            max_size = 1024
            if img.width > max_size or img.height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            image_data = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            ai_payload = await ai_service.analyze_medical_image(
                query=query,
                image_base64=image_data
            )
        elif mode == "deep_search":
            search_results = await search_service.search_medical_info(query)
            ai_payload = await ai_service.generate_response(
                query=query,
                search_context=search_results.get("context"),
                mode="deep_search"
            )
        elif mode == "expert":
            ai_payload = await ai_service.generate_response(
                query=query,
                mode="expert"
            )
        else:
            # Quick mode
            ai_payload = await ai_service.generate_response(
                query=query,
                mode="quick"
            )
        
        final_response = validator.add_safety_wrapper(ai_payload["response"])
        
        return {
            "query": query,
            "response": final_response,
            "confidence_score": ai_payload.get("confidence_score", 0.8),
            "sources": [],
            "disclaimer": "",
            "timestamp": None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Mangum handler for Vercel
handler = Mangum(app, lifespan="off")

# For direct invocation (local testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
