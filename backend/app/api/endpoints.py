import base64
import json
import logging
from datetime import datetime
from io import BytesIO
from typing import List

from app.models.database import MedicalQuery, SessionLocal, get_db
from app.models.schemas import MedicalQueryRequest, MedicalQueryResponse
from app.services.ai_service import MedicalAIService
from app.services.medical_validator import MedicalValidator
from app.services.search_service import MedicalSearchService
from fastapi import (APIRouter, BackgroundTasks, Depends, File, Form,
                     HTTPException, UploadFile)
from PIL import Image
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)
router = APIRouter()

ai_service = MedicalAIService()
search_service = MedicalSearchService()
validator = MedicalValidator()


@router.post("/query", response_model=MedicalQueryResponse, summary="Process a medical question")
async def process_medical_query(
    request: MedicalQueryRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> MedicalQueryResponse:
    validation = validator.validate_query(request.query)
    if not validation.get("valid"):
        raise HTTPException(status_code=400, detail=validation.get("message"))

    search_results = await search_service.search_medical_info(request.query)
    ai_payload = await ai_service.generate_response(
        query=request.query,
        search_context=search_results.get("context"),
    )

    final_response = validator.add_safety_wrapper(ai_payload["response"])
    sources: List[str] = []
    if request.include_sources:
        sources = [r.get("url") for r in search_results.get("results", [])[:3] if r.get("url")]

    response = MedicalQueryResponse(
        query=request.query,
        response=final_response,
        confidence_score=ai_payload["confidence_score"],
        sources=sources,
        disclaimer=validator.disclaimer,
        timestamp=datetime.utcnow(),
    )

    background_tasks.add_task(
        save_query_to_db,
        query=request.query,
        response=final_response,
        confidence=ai_payload["confidence_score"],
        sources=json.dumps(sources),
    )

    return response


@router.get("/history", summary="Retrieve query history")
def get_query_history(limit: int = 10, db: Session = Depends(get_db)):
    limit = max(1, min(limit, 50))
    records = (
        db.query(MedicalQuery)
        .order_by(MedicalQuery.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": record.id,
            "query": record.query,
            "response_preview": (record.response[:200] + "...") if record.response else "",
            "confidence_score": record.confidence_score,
            "created_at": record.created_at,
            "sources": json.loads(record.sources or "[]"),
        }
        for record in records
    ]


@router.post("/analyze", response_model=MedicalQueryResponse, summary="Analyze medical imaging with AI")
async def analyze_medical_image(
    query: str = Form(...),
    mode: str = Form("quick"),  # quick, image, deep_search, expert
    image: UploadFile = File(None),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
) -> MedicalQueryResponse:
    """
    Analyze medical queries with different AI modes:
    - quick: Fast responses with Gemini (default)
    - image: Medical imaging analysis with vision models
    - deep_search: In-depth research with web search
    - expert: Powerful models via OpenRouter
    """
    validation = validator.validate_query(query)
    if not validation.get("valid"):
        raise HTTPException(status_code=400, detail=validation.get("message"))

    image_data = None
    if image:
        # Validate image file
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        contents = await image.read()
        try:
            img = Image.open(BytesIO(contents))
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if too large (max 1024x1024 for API efficiency)
            max_size = 1024
            if img.width > max_size or img.height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            # Convert to base64 for AI processing
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            image_data = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            raise HTTPException(status_code=400, detail="Invalid image file")

    # Process based on mode
    search_sources = []  # Store sources for response
    
    if mode == "image" or image_data:
        # Image analysis mode
        ai_payload = await ai_service.analyze_medical_image(
            query=query,
            image_base64=image_data
        )
        mode_label = "IMAGE ANALYSIS"
        
    elif mode == "deep_search":
        # Deep search mode with web research
        search_results = await search_service.search_medical_info(query)
        ai_payload = await ai_service.generate_response(
            query=query,
            search_context=search_results.get("context"),
            mode="deep_search"
        )
        mode_label = "DEEP SEARCH"
        # Extract sources for display
        search_sources = search_results.get("results", [])[:10]  # Top 10 sources
        
    elif mode == "expert":
        # Expert mode with OpenRouter
        ai_payload = await ai_service.generate_response(
            query=query,
            search_context=None,
            mode="expert"
        )
        mode_label = "EXPERT MODE"
        
    else:
        # Quick mode (default)
        ai_payload = await ai_service.generate_response(
            query=query,
            search_context=None,
            mode="quick"
        )
        mode_label = "QUICK CONSULT"

    final_response = validator.add_safety_wrapper(ai_payload["response"])
    
    # No mode-specific disclaimer - handled in frontend to avoid repetition
    
    response = MedicalQueryResponse(
        query=query,
        response=final_response,
        confidence_score=ai_payload["confidence_score"],
        sources=search_sources,  # Include sources from deep search
        disclaimer="",  # Empty - disclaimer shown once in frontend UI
        timestamp=datetime.utcnow(),
    )

    if background_tasks:
        background_tasks.add_task(
            save_query_to_db,
            query=f"[{mode_label}] {query}",
            response=final_response,
            confidence=ai_payload["confidence_score"],
            sources="[]",
        )

    return response


def save_query_to_db(query: str, response: str, confidence: float, sources: str) -> None:
    session = SessionLocal()
    try:
        db_query = MedicalQuery(
            query=query,
            response=response,
            confidence_score=confidence,
            sources=sources,
        )
        session.add(db_query)
        session.commit()
    except Exception as exc:  # pragma: no cover - defensive logging
        session.rollback()
        logger.error("Failed to persist medical query: %s", exc)
    finally:
        session.close()
