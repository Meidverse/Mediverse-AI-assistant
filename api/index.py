"""
Vercel Serverless API - Standalone Medical AI Assistant
No dependencies on backend folder - all logic self-contained
"""
import os
import base64
import logging
from io import BytesIO
from typing import Optional

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

try:
    import google.generativeai as genai
    from PIL import Image
    SERVICES_AVAILABLE = True
except ImportError as e:
    logging.error(f"Import error: {e}")
    SERVICES_AVAILABLE = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Mediverse API",
    description="Medical AI Assistant API",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY and SERVICES_AVAILABLE:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Gemini API configured successfully")
    except Exception as e:
        logger.error(f"Failed to configure Gemini: {e}")
        SERVICES_AVAILABLE = False


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Mediverse API - Serverless v2.0",
        "status": "online",
        "services_available": SERVICES_AVAILABLE,
        "gemini_configured": bool(GEMINI_API_KEY)
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services_available": SERVICES_AVAILABLE,
        "gemini_api_key_set": bool(GEMINI_API_KEY)
    }

@app.post("/v1/analyze")
async def analyze(
    query: str = Form(...),
    mode: str = Form("quick"),
    image: UploadFile = File(None)
):
    """
    Analyze medical queries with AI
    
    Parameters:
    - query: Medical question or symptom description
    - mode: Analysis mode (quick, image, deep_search, expert)
    - image: Optional medical image file
    """
    try:
        # Check if services are available
        if not SERVICES_AVAILABLE:
            raise HTTPException(
                status_code=503,
                detail="AI services not available. Check server logs."
            )
        
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=503,
                detail="GEMINI_API_KEY not configured in environment variables"
            )
        
        # Validate query
        if not query or len(query.strip()) < 3:
            raise HTTPException(
                status_code=400,
                detail="Query must be at least 3 characters long"
            )
        
        # Process based on mode
        if mode == "image" and image:
            response_text = await analyze_with_image(query, image)
        else:
            response_text = await analyze_text_only(query, mode)
        
        # Add safety disclaimer
        final_response = add_medical_disclaimer(response_text)
        
        return {
            "query": query,
            "response": final_response,
            "confidence_score": 0.85,
            "mode": mode,
            "sources": [],
            "disclaimer": "This is AI-generated information for educational purposes only. Always consult healthcare professionals.",
            "timestamp": None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

async def analyze_with_image(query: str, image_file: UploadFile) -> str:
    """Analyze medical image with Gemini Vision"""
    try:
        # Read and process image
        contents = await image_file.read()
        img = Image.open(BytesIO(contents))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize if too large
        max_size = 1024
        if img.width > max_size or img.height > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        
        # Create prompt
        prompt = f"""You are a medical AI assistant analyzing a medical image.

Patient Query: {query}

Please analyze this medical image and provide:
1. What type of medical image this appears to be (X-ray, CT, MRI, etc.)
2. Observable features or patterns
3. Potential findings (be careful and conservative)
4. Recommendations for next steps

Remember: This is for educational purposes only. Always recommend consulting healthcare professionals."""

        # Use Gemini Vision model
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([prompt, img])
        
        return response.text
        
    except Exception as e:
        logger.error(f"Image analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze image: {str(e)}"
        )

async def analyze_text_only(query: str, mode: str) -> str:
    """Analyze text query with Gemini"""
    try:
        # Create mode-specific prompt
        if mode == "expert":
            system_prompt = """You are an expert medical AI assistant with deep knowledge across all medical specialties. 
Provide comprehensive, detailed analysis with medical terminology when appropriate."""
        elif mode == "deep_search":
            system_prompt = """You are a medical research assistant. Provide thorough, evidence-based responses 
with consideration of current medical literature and guidelines."""
        else:  # quick mode
            system_prompt = """You are a helpful medical AI assistant. Provide clear, concise, and accurate 
medical information in an easy-to-understand format."""
        
        prompt = f"""{system_prompt}

Patient Query: {query}

Please provide a helpful response that includes:
1. Understanding of the query/symptoms
2. Relevant medical information
3. General guidance (while emphasizing the need for professional consultation)
4. When to seek immediate medical attention (if applicable)

Remember: Always emphasize that this is educational information and recommend consulting healthcare professionals for diagnosis and treatment."""

        # Use Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        return response.text
        
    except Exception as e:
        logger.error(f"Text analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}"
        )

def add_medical_disclaimer(text: str) -> str:
    """Add safety disclaimer to AI response"""
    disclaimer = "\n\n---\n⚠️ **Medical Disclaimer**: This information is AI-generated for educational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
    
    return text + disclaimer

# Mangum handler for Vercel
handler = Mangum(app, lifespan="off")

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

