from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # API Keys
    GEMINI_API_KEY: str
    TAVILY_API_KEY: str
    LLM_PROVIDER: str = "gemini"
    GEMINI_MODEL: str = "models/gemini-2.5-flash"
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_MODEL: str = "meta-llama/llama-3.1-70b-instruct"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_SITE_URL: Optional[str] = None
    OPENROUTER_APP_NAME: str = "Mediverse"

    # Database
    DATABASE_URL: str = "postgresql://user:pass@localhost/medical_ai"
    SUPABASE_DB_URL: Optional[str] = None
    REDIS_URL: str = "redis://default:NlhoveX5lX9bVWP11REM3jX64m0f8wxu@redis-17423.c305.ap-south-1-1.ec2.redns.redis-cloud.com:17423"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Medical AI Settings
    MAX_RESPONSE_LENGTH: int = 8000  # Increased for detailed medical outputs
    CONFIDENCE_THRESHOLD: float = 0.7
    ENABLE_MEDICAL_VALIDATION: bool = True
    
    # Search Settings
    MAX_SEARCH_RESULTS: int = 10  # More web results for comprehensive research
    SEARCH_DEPTH: str = "advanced"  # Advanced search for medical queries

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 20

    # Logging / Monitoring
    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"

    # Redis caching behaviour
    CACHE_TTL_SECONDS: int = 300
    CACHE_NAMESPACE: str = "medical_ai"

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).parent.parent / ".env"),
        env_file_encoding="utf-8",
    )


@lru_cache()
def get_settings() -> Settings:
    """Return a cached settings instance."""

    return Settings()
