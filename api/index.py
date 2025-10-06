# Vercel Python Serverless Function with Gemini AI
from http.server import BaseHTTPRequestHandler
import json
import os
import traceback
from urllib.parse import parse_qs
from io import BytesIO
import warnings

# Suppress gRPC ALTS warnings
os.environ['GRPC_VERBOSITY'] = 'ERROR'
os.environ['GLOG_minloglevel'] = '2'
warnings.filterwarnings('ignore', category=UserWarning, module='google.auth')

# Import Gemini AI
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

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
        try:
            # Get content length
            content_length = int(self.headers.get('Content-Length', 0))
            
            # Read the POST data
            post_data = self.rfile.read(content_length)
            
            # Parse path (remove query params)
            path = self.path.split('?')[0]
            
            if 'analyze' in path:
                # Parse request data (support both JSON and FormData)
                query = None
                mode = 'quick'
                
                content_type = self.headers.get('Content-Type', '')
                
                if 'application/json' in content_type:
                    # Parse JSON request
                    try:
                        request_data = json.loads(post_data.decode('utf-8'))
                        query = request_data.get('query', '')
                        mode = request_data.get('mode', 'quick')
                    except json.JSONDecodeError:
                        self.send_error_response(400, "Invalid JSON in request body")
                        return
                        
                elif 'multipart/form-data' in content_type:
                    # Parse FormData - extract boundary and fields
                    try:
                        # Extract boundary from Content-Type header
                        boundary = None
                        for part in content_type.split(';'):
                            if 'boundary=' in part:
                                boundary = part.split('boundary=')[1].strip()
                                break
                        
                        if not boundary:
                            self.send_error_response(400, "Missing boundary in multipart/form-data")
                            return
                        
                        body_str = post_data.decode('utf-8', errors='ignore')
                        
                        # Split by boundary
                        parts = body_str.split('--' + boundary)
                        
                        for part in parts:
                            if 'name="query"' in part:
                                # Extract query value
                                lines = part.split('\r\n')
                                for i, line in enumerate(lines):
                                    if line == '' and i + 1 < len(lines):
                                        # Next line after empty line is the value
                                        query = lines[i + 1].strip()
                                        break
                            
                            if 'name="mode"' in part:
                                # Extract mode value
                                lines = part.split('\r\n')
                                for i, line in enumerate(lines):
                                    if line == '' and i + 1 < len(lines):
                                        mode = lines[i + 1].strip()
                                        break
                        
                        # Fallback to old parsing if new method didn't work
                        if not query:
                            if 'name="query"' in body_str:
                                start = body_str.find('name="query"')
                                start = body_str.find('\r\n\r\n', start) + 4
                                end = body_str.find('\r\n--', start)
                                if end == -1:
                                    end = body_str.find('--\r\n', start)
                                if end > start:
                                    query = body_str[start:end].strip()
                            
                    except Exception as parse_error:
                        self.send_error_response(400, f"Error parsing form data: {str(parse_error)}")
                        return
                else:
                    self.send_error_response(400, "Unsupported Content-Type. Use application/json or multipart/form-data")
                    return
                
                if not query:
                    # Provide detailed error for debugging
                    error_details = {
                        "message": "Missing 'query' field in request",
                        "content_type": content_type,
                        "parsed_query": query,
                        "parsed_mode": mode,
                        "hint": "Ensure FormData includes 'query' field"
                    }
                    self.send_error_response(400, "Missing 'query' field in request", error_details)
                    return
                
                # Check if Gemini API key is configured
                gemini_api_key = os.getenv('GEMINI_API_KEY')
                
                if not gemini_api_key or not GEMINI_AVAILABLE:
                    self.send_error_response(
                        503,
                        "Gemini AI not configured. Please add GEMINI_API_KEY environment variable.",
                        details={
                            "gemini_available": GEMINI_AVAILABLE,
                            "api_key_set": bool(gemini_api_key)
                        }
                    )
                    return
                
                # Generate AI response
                response = self.generate_medical_response(query, mode, gemini_api_key)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            else:
                self.send_error_response(404, "Unknown endpoint", {"hint": "Use POST /api/v1/analyze"})
                
        except Exception as e:
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def generate_medical_response(self, query: str, mode: str, api_key: str):
        """Generate medical response using Gemini AI."""
        try:
            # Suppress any additional gRPC/ALTS warnings
            import logging
            logging.getLogger('google.auth').setLevel(logging.ERROR)
            logging.getLogger('google.api_core').setLevel(logging.ERROR)
            
            # Configure Gemini
            genai.configure(api_key=api_key)
            
            # Configure generation settings for better, complete responses
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,  # Allow longer responses
                "response_mime_type": "text/plain",
            }
            
            model = genai.GenerativeModel(
                'gemini-2.0-flash-exp',
                generation_config=generation_config
            )
            
            # Let Gemini work naturally without heavy prompting
            # Commented out custom prompts - using natural AI behavior
            # system_prompt = self.get_system_prompt(mode)
            # full_prompt = f"{system_prompt}\n\nUser Query: {query}"
            
            # Simple medical context prompt
            simple_prompt = f"""You are a medical AI assistant. Answer the following medical question clearly and helpfully:

{query}"""
            
            # Generate response with timeout handling
            response = model.generate_content(simple_prompt)
            
            return {
                "response": response.text,
                "mode": mode,
                "status": "success",
                "disclaimer": "⚕️ This is AI-generated medical information for educational purposes only. Always consult a healthcare professional for medical advice."
            }
            
        except Exception as e:
            return {
                "response": f"I apologize, but I encountered an error processing your request: {str(e)}",
                "mode": mode,
                "status": "error",
                "error_details": traceback.format_exc()
            }
    
    def get_system_prompt(self, mode: str) -> str:
        """Return appropriate system prompt based on mode."""
        
        base_prompt = """You are Mediverse AI, a helpful and knowledgeable medical AI assistant. 

**Your Role:**
- Answer ANY medical, health, or wellness question the user asks
- Provide evidence-based information in a clear, friendly manner
- If the query is casual (like "hello", "hi", "test"), respond warmly and invite them to ask a medical question
- For medication questions, provide comprehensive information about uses, dosage, side effects, precautions, etc.
- Never refuse to answer or say "please provide a medical question" - just answer what they asked!
- Take your time to provide COMPLETE, thorough answers - don't rush or cut off mid-sentence

**Guidelines:**
1. Always prioritize patient safety and accuracy
2. Cite medical sources when possible  
3. Be clear about limitations and when professional consultation is needed
4. Use clear, accessible language while maintaining medical accuracy
5. Include relevant disclaimers for serious conditions
6. Be helpful and responsive - answer ALL questions directly
7. Provide COMPLETE information - finish your thoughts and explanations fully

**Important:** Give complete, well-structured answers. Don't truncate or rush. The user values thorough, helpful information.
"""
        
        mode_prompts = {
            "quick": base_prompt + """

**Quick Consult Mode:**
Provide a concise but COMPLETE answer covering:
- What it is / definition
- Main uses or symptoms
- Key information the user needs
- Important precautions or when to see a doctor

Be concise but thorough - finish all important points.""",
            
            "image": base_prompt + """

**Image Analysis Mode:**
Analyze the medical image or scan description provided. Provide a comprehensive analysis including:
- Key findings and observations
- Potential diagnoses or differential diagnoses
- Recommended next steps or further tests
- When to seek immediate medical attention
- Limitations of AI analysis

Be thorough and complete in your assessment.""",
            
            "deep_search": base_prompt + """

**Deep Search Mode:**
Provide a comprehensive, research-backed analysis with COMPLETE information on:
- Detailed explanation of the condition/topic
- Pathophysiology (if relevant)
- Current medical research and clinical guidelines
- Evidence-based treatment options
- Prevention strategies and lifestyle modifications
- When to seek immediate medical care
- Prognosis and long-term outlook
- Common misconceptions

Take your time to provide thorough, well-researched information.""",
            
            "expert": base_prompt + """

**Expert Mode:**
Provide an expert-level medical analysis with COMPLETE, detailed information:
- Comprehensive differential diagnoses with reasoning
- Evidence-based treatment protocols and algorithms
- Latest clinical guidelines and recommendations
- Risk stratification and prognostic factors
- Recommended investigations and diagnostic workup
- Clinical pearls and nuanced considerations
- Management of complications
- Special populations considerations

Provide thorough, expert-level detail - this is for in-depth medical knowledge."""
        }
        
        return mode_prompts.get(mode, mode_prompts["quick"])
    
    def send_error_response(self, status_code: int, message: str, details: dict = None):
        """Send an error response."""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {
            "error": message,
            "status": "error"
        }
        
        if details:
            error_response["details"] = details
        
        self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
        return

