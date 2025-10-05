"""Bootstrap the database schema for Mediverse.

Run this script after configuring your DATABASE_URL / SUPABASE_DB_URL
so that the required tables exist before the application starts logging
queries.

Usage (loads variables from .env):
    python -m dotenv run -- python scripts/init_db.py
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

from sqlalchemy.exc import SQLAlchemyError

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.models.database import (  # noqa: E402  (import after sys.path setup)
    Base, engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("Creating database tables using %s", engine.url)
    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError as exc:
        logger.exception("Failed to create tables: %s", exc)
        raise SystemExit(1) from exc

    logger.info("Database initialization complete.")


if __name__ == "__main__":
    main()
