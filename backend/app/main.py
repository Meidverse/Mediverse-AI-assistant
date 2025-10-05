import logging
from contextlib import asynccontextmanager
from datetime import datetime

from app.api.endpoints import router
from app.api.middleware import RateLimitMiddleware
from app.config import get_settings
from app.utils.logger import setup_logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app

setup_logging()
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Mediverse...")
    try:
        yield
    finally:
        logger.info("Shutting down Mediverse...")


app = FastAPI(
    title="Mediverse",
    description="Production-ready medical AI assistant powered by Gemini, OpenRouter, and Tavily",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RateLimitMiddleware)

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

app.include_router(router, prefix="/api/v1", tags=["medical"])


@app.get("/")
async def root():
    return {
        "message": "Mediverse API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "mediverse",
        "timestamp": datetime.utcnow(),
    }
