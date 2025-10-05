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

from app.main import app
from mangum import Mangum

# Vercel will call the 'handler' function
# Mangum wraps FastAPI to work with serverless
handler = Mangum(app, lifespan="off")

# For direct invocation (local testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
