import os
from typing import Generator

import pytest

# Provide default configuration values for tests *before* importing the app
os.environ.setdefault("GEMINI_API_KEY", "AIzaSyCcdwWlj0SjUnFBVzwWKOPOwT2WM4YukeM")
os.environ.setdefault("TAVILY_API_KEY", "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")
os.environ.setdefault("SECRET_KEY", "ad2fab36c748a96660691d7e2ab6db07b33f5fe433c8887164f6139df0e72f5c")
os.environ.setdefault("LLM_PROVIDER", "gemini")
os.environ.setdefault("OPENROUTER_API_KEY", "")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("SUPABASE_DB_URL", "")
os.environ.setdefault("REDIS_URL", "redis://default:NlhoveX5lX9bVWP11REM3jX64m0f8wxu@redis-17423.c305.ap-south-1-1.ec2.redns.redis-cloud.com:17423")

from app.models.database import Base, engine

Base.metadata.create_all(bind=engine)


@pytest.fixture(scope="session")
def anyio_backend() -> Generator[str, None, None]:
    # Ensure pytest-asyncio uses asyncio backend for async tests
    yield "asyncio"
