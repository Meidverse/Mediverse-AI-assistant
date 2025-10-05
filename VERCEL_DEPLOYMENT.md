# 🚀 Vercel Deployment Guide

Complete guide to deploy Mediverse AI Assistant on Vercel with Next.js frontend and FastAPI serverless backend.

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Code pushed to GitHub (already done ✅)
3. **API Keys**: 
   - Google Gemini API Key
   - Tavily API Key (for web search)
   - OpenRouter API Key (for Expert mode)
   - Secret Key (for JWT tokens)

---

## 🏗️ Project Structure (Vercel-Ready)

```
medical-ai-assistant/
├── api/                      # Serverless API functions
│   └── index.py             # FastAPI wrapper for Vercel
├── backend/                  # Original backend code
│   └── app/                 # FastAPI application
├── frontend/                 # Next.js frontend
│   ├── app/
│   ├── components/
│   └── package.json
├── vercel.json              # Vercel configuration
└── requirements.txt         # Python dependencies for serverless
```

---

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository: `Meidverse/Mediverse-AI-assistant`
4. Click **"Import"**

#### Step 2: Configure Build Settings

**Root Directory**: Leave as `/` (root)

**Framework Preset**: Select `Next.js`

**Build Command**: 
```bash
cd frontend && npm run build
```

**Output Directory**: 
```
frontend/.next
```

**Install Command**: 
```bash
cd frontend && npm install
```

#### Step 3: Set Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `GEMINI_API_KEY` | `your-gemini-api-key` | Production, Preview, Development |
| `TAVILY_API_KEY` | `your-tavily-api-key` | Production, Preview, Development |
| `OPENROUTER_API_KEY` | `your-openrouter-api-key` | Production, Preview, Development |
| `SECRET_KEY` | `your-secret-key-min-32-chars` | Production, Preview, Development |
| `NEXT_PUBLIC_API_BASE_URL` | `/api` | Production |
| `DATABASE_URL` | `your-db-url` (optional) | Production |
| `REDIS_URL` | `your-redis-url` (optional) | Production |

**Note**: For `SECRET_KEY`, generate a secure key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build to complete
3. Your app will be live at `https://your-project.vercel.app`

---

### Option 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy from Root
```bash
cd c:\mediverse\medical-ai-assistant
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: mediverse-ai-assistant
- **Directory**: `./` (root)

#### Step 4: Set Environment Variables
```bash
vercel env add GEMINI_API_KEY
vercel env add TAVILY_API_KEY
vercel env add OPENROUTER_API_KEY
vercel env add SECRET_KEY
```

#### Step 5: Deploy to Production
```bash
vercel --prod
```

---

## ⚙️ How It Works

### Frontend (Next.js)
- Deployed as static site with server-side rendering
- Lives in `/frontend` directory
- API calls route to `/api/*`

### Backend (FastAPI Serverless)
- Wrapped by `api/index.py` using Mangum adapter
- Each API request spawns serverless function
- Cold starts: ~1-3 seconds (first request)
- Warm requests: ~100-300ms

### Routing
```
https://your-app.vercel.app/          → Next.js frontend
https://your-app.vercel.app/api/v1/*  → FastAPI serverless backend
```

---

## 🔧 Vercel Configuration Explained

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"        // Next.js builder
    },
    {
      "src": "api/index.py",
      "use": "@vercel/python"       // Python serverless
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.py"       // Route /api/* to Python
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"        // Route everything else to Next.js
    }
  ]
}
```

### `api/index.py` (Serverless Wrapper)
```python
from mangum import Mangum
from app.main import app

# Mangum converts FastAPI to serverless handler
handler = Mangum(app, lifespan="off")
```

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain
1. Go to Project Settings → Domains
2. Add your domain: `mediverse.yourdomain.com`
3. Update DNS records:
   ```
   Type: CNAME
   Name: mediverse
   Value: cname.vercel-dns.com
   ```

---

## 🐛 Troubleshooting

### Issue: Build Fails - Module Not Found

**Solution**: Ensure `requirements.txt` is in root directory
```bash
# Check file exists
ls requirements.txt
```

### Issue: API Returns 500 Error

**Solution**: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project
2. Click **"Functions"** tab
3. View error logs for `/api/index.py`

**Common causes**:
- Missing environment variables
- Import errors (check Python path in `api/index.py`)
- Database connection issues (serverless has no persistent DB)

### Issue: Cold Start Too Slow

**Solution**: Optimize imports in `api/index.py`
```python
# Lazy load heavy libraries
def handler(event, context):
    from app.main import app
    from mangum import Mangum
    return Mangum(app, lifespan="off")(event, context)
```

### Issue: Frontend Can't Connect to API

**Solution**: Check environment variable
```bash
# Verify NEXT_PUBLIC_API_BASE_URL is set
vercel env ls
```

Should show: `NEXT_PUBLIC_API_BASE_URL=/api`

---

## 📊 Performance Optimization

### 1. Enable Edge Caching
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/v1/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate=30"
        }
      ]
    }
  ]
}
```

### 2. Reduce Cold Starts
- Keep functions under 50MB
- Minimize dependencies in `requirements.txt`
- Use lazy imports

### 3. Optimize Images
```typescript
// In Next.js components
import Image from 'next/image'

<Image 
  src="/path/to/image.jpg"
  width={500}
  height={300}
  alt="Medical scan"
  priority={true}  // Preload critical images
/>
```

---

## 🔒 Security Best Practices

### 1. Never Commit API Keys
```bash
# .gitignore should include:
.env
.env.local
.env.production
```

### 2. Use Vercel Environment Variables
- All secrets in Vercel Dashboard
- Never hardcode in code

### 3. Enable Rate Limiting
Already configured in `app/api/middleware.py`:
```python
RATE_LIMIT_PER_MINUTE = 20
```

### 4. CORS Configuration
Already set in `app/main.py`:
```python
allow_origins=["*"]  # Change to your domain in production
```

**Recommended for production**:
```python
allow_origins=["https://your-domain.vercel.app"]
```

---

## 📈 Monitoring

### Vercel Analytics
1. Enable in Dashboard → Analytics
2. View:
   - Page views
   - API calls
   - Performance metrics
   - Error rates

### Function Logs
```bash
# View real-time logs
vercel logs --follow
```

### Custom Monitoring
Already integrated in backend:
- Prometheus metrics at `/metrics`
- Health check at `/health`

---

## 💰 Cost Estimates

### Vercel Pricing (Hobby Tier - FREE)
- ✅ 100 GB bandwidth/month
- ✅ 100 hours serverless execution/month
- ✅ Unlimited sites
- ✅ Custom domains

### Vercel Pro ($20/month)
- ✅ 1 TB bandwidth
- ✅ 1000 hours serverless execution
- ✅ Team collaboration
- ✅ Advanced analytics

**Estimated Usage (Medical AI)**:
- Image analysis: ~2-5 seconds/request
- Text query: ~1-2 seconds/request
- ~1000 requests/month = ~40 hours ≈ FREE TIER

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push
1. Every push to `main` branch triggers deployment
2. Preview deployments for pull requests
3. Rollback to previous deployment anytime

### Manual Deploy
```bash
# Deploy specific branch
vercel --prod --branch=main

# Deploy with specific commit
vercel --prod --commit=abc123
```

---

## 📝 Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API | `AIzaSy...` |
| `TAVILY_API_KEY` | ✅ Yes | Tavily search API | `tvly-...` |
| `OPENROUTER_API_KEY` | ✅ Yes | OpenRouter API | `sk-or-...` |
| `SECRET_KEY` | ✅ Yes | JWT secret (32+ chars) | `random-secret-key...` |
| `NEXT_PUBLIC_API_BASE_URL` | ✅ Yes | API endpoint | `/api` |
| `DATABASE_URL` | ❌ No | PostgreSQL URL | `postgresql://...` |
| `REDIS_URL` | ❌ No | Redis cache URL | `redis://...` |

---

## 🎯 Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Frontend loads correctly
- [ ] API health check works: `/health`
- [ ] Test Quick Consult mode
- [ ] Test Image Analysis (upload X-ray)
- [ ] Test Deep Search mode
- [ ] Test Expert Mode
- [ ] Verify sources display in Deep Search
- [ ] Check markdown rendering
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Enable analytics (optional)
- [ ] Configure CORS for production domain

---

## 🆘 Support

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Python on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/python)

### Project Issues
- GitHub Issues: `https://github.com/Meidverse/Mediverse-AI-assistant/issues`
- Vercel Community: [community.vercel.com](https://community.vercel.com)

---

## 🎉 Success!

Your Mediverse AI Assistant is now live on Vercel! 🚀

**Next Steps**:
1. Share your deployment URL
2. Monitor usage in Vercel Dashboard
3. Collect user feedback
4. Iterate and improve

**Deployment URL**: `https://your-project.vercel.app`

---

## 📚 Additional Resources

- [FastAPI + Vercel Guide](https://vercel.com/guides/using-fastapi-with-vercel)
- [Mangum Documentation](https://mangum.io/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

**Last Updated**: October 6, 2025  
**Version**: 1.0.0  
**Maintained by**: Mediverse Team
