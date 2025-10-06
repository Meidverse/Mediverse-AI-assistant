"""
Minimal Vercel Serverless API for testing
"""
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import json

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
    return {"status": "healthy", "test": "working"}

# Mangum handler for AWS Lambda / Vercel
handler = Mangum(app, lifespan="off")

# WSGI compatibility for Vercel
def application(environ, start_response):
    """WSGI application wrapper"""
    return handler(environ, start_response)

