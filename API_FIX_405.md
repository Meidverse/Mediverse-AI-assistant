# 405 Error Fix - Deployment Update

## Issue Summary

**Error**: `POST /api/v1/analyze` returned **405 (Method Not Allowed)**

**Cause**: The original `api/index.py` was importing the full backend FastAPI app which included:
- Lifespan context managers (not compatible with Vercel serverless)
- Rate limiting middleware (requires state management)
- Prometheus metrics (not suitable for serverless)
- Database connections (trying to connect on startup)

These features work great for a traditional server deployment but cause issues in Vercel's stateless serverless environment.

---

## What Was Fixed

### Created Standalone Serverless API

The new `api/index.py` now:

✅ **Creates its own lightweight FastAPI app** instead of importing from backend  
✅ **Removes problematic middlewares** (RateLimitMiddleware, Prometheus)  
✅ **Removes lifespan manager** (startup/shutdown hooks don't work in serverless)  
✅ **Implements endpoints directly** for better serverless compatibility  
✅ **Maintains CORS support** for frontend requests  
✅ **Proper error handling** for serverless environment  

### Endpoints Available

```
GET  /              - API info and status
GET  /api/health    - Health check  
POST /api/v1/analyze - Main analysis endpoint (all 4 modes)
```

---

## Testing After Deployment

Once Vercel finishes deploying, test with:

### 1. Check API is Online
```bash
curl https://mediverseai.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": true
}
```

### 2. Test Quick Consult Mode
```bash
curl -X POST https://mediverseai.vercel.app/api/v1/analyze \
  -F "query=What is hypertension?" \
  -F "mode=quick"
```

### 3. Test From Browser
1. Go to https://mediverseai.vercel.app
2. Select **Quick Consult** mode
3. Type: "What is diabetes?"
4. Send message
5. Check browser console - should see **200** response instead of **405**

---

## Required Environment Variables

⚠️ **The API will return errors if these aren't set in Vercel:**

### Critical
- `GEMINI_API_KEY` - For AI responses
- `SECRET_KEY` - For security

### Optional
- `TAVILY_API_KEY` - For deep search mode
- `GROQ_API_KEY` - For alternative LLM
- `OPENROUTER_API_KEY` - For expert mode

**Add these in**: Vercel Dashboard → Settings → Environment Variables

---

## How It Works Now

### Request Flow
```
User → Frontend → /api/v1/analyze → Vercel Routes to api/index.py → 
Mangum Handler → FastAPI App → AI Services → Response
```

### Mode Handling
- **Quick Consult**: Uses Gemini for fast responses
- **Image Analysis**: Processes uploaded medical images with Gemini Vision
- **Deep Search**: Uses Tavily API for web research (requires TAVILY_API_KEY)
- **Expert Mode**: Uses OpenRouter or Groq for advanced analysis

---

## What's Different From Before

### Before (Broken)
```python
# api/index.py
from app.main import app  # Imported full backend app
handler = Mangum(app, lifespan="off")
```

Problems:
- ❌ App tried to initialize DB connections
- ❌ Middleware required state management
- ❌ Prometheus tried to mount metrics endpoint
- ❌ Lifespan hooks caused initialization failures

### After (Working)
```python
# api/index.py
app = FastAPI(...)  # Create simple app for serverless
app.add_middleware(CORSMiddleware, ...)  # Only CORS
@app.post("/api/v1/analyze")  # Direct endpoint
handler = Mangum(app, lifespan="off")
```

Benefits:
- ✅ Lightweight initialization
- ✅ Only essential middleware
- ✅ Direct endpoint implementation
- ✅ Better error handling for serverless

---

## Next Steps

1. **Wait for Vercel deployment** to complete (1-2 minutes)
2. **Add environment variables** in Vercel Dashboard
3. **Test all 4 modes** to verify functionality
4. **Check browser console** - should see 200 responses

---

## If Issues Persist

### Check Vercel Function Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to **Functions** tab
4. Look for errors in the `/api/index` function logs

### Common Issues

**503 Service Unavailable**
- Environment variables not set
- AI services failed to initialize
- Check function logs for specific error

**500 Internal Server Error**
- Check if GEMINI_API_KEY is valid
- Verify API key has correct permissions
- Check function logs for stack trace

**Still 405**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check if deployment actually updated (compare git commits)

---

**Deployment Commit**: bf96c51b  
**Last Updated**: October 6, 2025
