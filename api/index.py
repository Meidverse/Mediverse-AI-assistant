# Simple Vercel Python function without FastAPI
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Parse the path - Vercel strips /api prefix, so /api/health becomes /health
        path = self.path.rstrip('/')  # Remove trailing slash
        
        # Route based on path
        if path == '/health' or path == '':
            # /api/health (becomes /health) or /api (becomes /)
            response = {
                "status": "healthy",
                "message": "Mediverse API is running",
                "version": "v6"
            }
        else:
            response = {
                "message": "Mediverse API v6 - Python Handler",
                "status": "online",
                "path": path,
                "endpoints": {
                    "GET /api": "API info",
                    "GET /api/health": "Health check",
                    "POST /api/v1/analyze": "Medical AI analysis"
                }
            }
        
        self.wfile.write(json.dumps(response).encode())
        return
    
    def do_POST(self):
        # Get content length
        content_length = int(self.headers.get('Content-Length', 0))
        
        # Read the POST data
        post_data = self.rfile.read(content_length)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Vercel strips /api, so /api/v1/analyze becomes /v1/analyze
        path = self.path.rstrip('/')
        
        if '/analyze' in path or path == '/analyze':
            # For now, return a placeholder response
            response = {
                "message": "POST endpoint working! Add GEMINI_API_KEY to Vercel env vars for AI responses.",
                "status": "success",
                "received_path": path,
                "note": "Medical AI functionality requires GEMINI_API_KEY environment variable"
            }
        else:
            response = {
                "error": "Unknown endpoint",
                "path": path,
                "hint": "Use POST /api/v1/analyze for medical AI"
            }
        
        self.wfile.write(json.dumps(response).encode())
        return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
        return

