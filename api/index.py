# Simple Vercel Python function without FastAPI
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Parse the path
        path = self.path
        
        # Route based on path
        if path == '/health' or path == '/api/health':
            response = {
                "status": "healthy",
                "message": "Mediverse API is running"
            }
        else:
            response = {
                "message": "Mediverse API v5 - Python Handler Working!",
                "status": "online",
                "path": path,
                "note": "Use /health for health check, POST to /analyze for medical AI"
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
        
        path = self.path
        
        if path == '/analyze' or path == '/api/v1/analyze' or path == '/v1/analyze':
            # For now, return a placeholder response
            response = {
                "message": "POST endpoint working! Add GEMINI_API_KEY to Vercel env vars for AI responses.",
                "status": "success",
                "note": "Medical AI functionality requires GEMINI_API_KEY environment variable"
            }
        else:
            response = {
                "error": "Unknown endpoint",
                "path": path
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

