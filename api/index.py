# Simple Vercel Python function without FastAPI
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Route based on path (vercel rewrites send query params)
        path = self.path.split('?')[0]  # Remove query params
        
        if 'health' in path:
            response = {
                "status": "healthy",
                "message": "Mediverse API is running",
                "service": "Medical AI Assistant"
            }
        else:
            response = {
                "message": "Mediverse Medical AI API",
                "status": "online",
                "version": "1.0",
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
        
        # Parse path (remove query params)
        path = self.path.split('?')[0]
        
        if 'analyze' in path:
            # Placeholder response - GEMINI_API_KEY needed for actual AI
            response = {
                "message": "Analysis endpoint ready! Add GEMINI_API_KEY to Vercel environment variables for AI responses.",
                "status": "success",
                "note": "Medical AI functionality requires GEMINI_API_KEY environment variable",
                "next_steps": [
                    "Go to Vercel Dashboard → mediverseai project → Settings → Environment Variables",
                    "Add GEMINI_API_KEY with your API key from https://aistudio.google.com/apikey",
                    "Redeploy to activate AI responses"
                ]
            }
        else:
            response = {
                "error": "Unknown endpoint",
                "path": path,
                "hint": "Use POST /api/v1/analyze for medical AI analysis"
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

