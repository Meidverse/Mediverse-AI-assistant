"""
Minimal Vercel Serverless API for testing
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI(title="Mediverse API Test")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Mediverse API v3 - Minimal Test", "status": "online"}

@app.get("/health")
def health():
    return {"status": "healthy"}

handler = Mangum(app, lifespan="off")
