from datetime import datetime
from typing import Generator
from urllib.parse import quote, unquote

from app.config import get_settings
from sqlalchemy import (Column, DateTime, Float, Integer, String, Text,
                        create_engine)
from sqlalchemy.orm import declarative_base, sessionmaker

settings = get_settings()

def _normalize_database_url(url: str) -> str:
    if not url:
        return url

    if "://" not in url or "@" not in url:
        return url

    scheme, rest = url.split("://", 1)

    if "@" not in rest:
        return url

    credentials, host_part = rest.rsplit("@", 1)

    if ":" not in credentials:
        return url

    user, password = credentials.split(":", 1)
    decoded_password = unquote(password)
    safe_password = quote(decoded_password, safe="")

    return f"{scheme}://{user}:{safe_password}@{host_part}"


database_url = _normalize_database_url(settings.SUPABASE_DB_URL or settings.DATABASE_URL)

connect_args = {}
if database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
elif "supabase.co" in database_url and "sslmode=" not in database_url:
    connect_args["sslmode"] = "require"

engine = create_engine(
    database_url,
    future=True,
    pool_pre_ping=True,
    connect_args=connect_args,
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class MedicalQuery(Base):
    __tablename__ = "medical_queries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    confidence_score = Column(Float, nullable=False)
    sources = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


def get_db() -> Generator:
    """Database session dependency for FastAPI routes."""

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
