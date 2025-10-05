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

from app.main import app
from mangum import Mangum

# Mangum adapter for AWS Lambda/Vercel serverless
handler = Mangum(app, lifespan="off")

# For direct invocation
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
