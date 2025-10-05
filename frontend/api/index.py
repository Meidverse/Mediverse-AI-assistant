"""
Vercel Serverless API Entry Point
Wraps FastAPI application for Vercel's Python runtime
"""
import os
import sys
from pathlib import Path

# Add backend directory to Python path  
root_path = Path(__file__).parent.parent.parent
backend_path = root_path / "backend"
sys.path.insert(0, str(backend_path))

# Set environment to production
os.environ.setdefault("ENVIRONMENT", "production")

from app.main import app
from mangum import Mangum

# Mangum adapter for Vercel serverless
handler = Mangum(app, lifespan="off")

# Export for Vercel
import sys
from pathlib import Path

# Add backend to Python path (one level up from frontend/api/)
backend_path = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Import FastAPI app
from app.main import app
from mangum import Mangum

# Export handler for Vercel
handler = Mangum(app, lifespan="off")
