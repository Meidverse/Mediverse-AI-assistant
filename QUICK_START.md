# 🚀 Quick Start Guide - Mediverse AI

## ✅ Your Deployment is LIVE!

**URL:** https://mediverseai.vercel.app

---

## 🔑 Required: Add API Keys to Vercel

### Minimum Required (3 keys):

| Variable | Get From | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) | AI Analysis |
| `TAVILY_API_KEY` | [Tavily](https://tavily.com) | Web Search |
| `SECRET_KEY` | Generate random 32+ chars | Security |

### How to Add in Vercel:

1. **Go to:** [Vercel Dashboard](https://vercel.com/dashboard)
2. **Select:** Your project → Settings → Environment Variables
3. **Add each variable:**
   - Click "Add New"
   - Enter Key name
   - Paste Value
   - Select all environments
   - Save

4. **Redeploy:**
   - Go to Deployments tab
   - Click latest deployment
   - Click "Redeploy"

---

## 🧪 Test Your Deployment

### 1. Frontend Test
```
Visit: https://mediverseai.vercel.app
- Should see the landing page
- Try the chat interface
- Test image upload
```

### 2. API Test
```
Visit: https://mediverseai.vercel.app/api
- Should see: {"message": "Mediverse API", "version": "1.0.0"}
```

### 3. Health Check
```
Visit: https://mediverseai.vercel.app/api/health
- Should see: {"status": "healthy"}
```

---

## 📝 Current Project Structure

```
✅ Next.js App (root)
   ├── app/              → Pages & layouts
   ├── components/       → React components
   ├── lib/              → Utilities
   └── public/           → Static assets

✅ Python API (serverless)
   └── api/index.py      → FastAPI endpoint

✅ Backend (for Docker)
   └── backend/          → Full backend code
```

---

## 🎯 Features Available

### Mode 1: Quick Consult
- Fast medical Q&A
- Uses Gemini AI
- No image required

### Mode 2: Image Analysis
- Upload medical scans (X-ray, CT, MRI)
- AI-powered diagnosis
- Confidence scoring

### Mode 3: Deep Search
- Advanced web research
- Cites medical sources
- Evidence-based answers

### Mode 4: Expert Mode
- Comprehensive analysis
- Multiple AI models
- Detailed explanations

---

## ⚠️ Important Notes

1. **For Educational Use Only**
   - Not a replacement for professional medical advice
   - Always consult healthcare professionals

2. **API Limits**
   - Free tier limits apply
   - Monitor your usage in provider dashboards

3. **Data Privacy**
   - No medical data is stored
   - All processing is stateless

---

## 🐛 Troubleshooting

### Site loads but AI doesn't work?
→ Add API keys in Vercel and redeploy

### "Failed to analyze" error?
→ Check Vercel Function logs for API key errors

### Deployment failed?
→ Check build logs in Vercel dashboard

---

## 📚 Next Steps

1. ✅ Add environment variables
2. ✅ Test all 4 modes
3. ✅ Check function logs
4. ✅ Monitor API usage
5. ✅ Customize branding (optional)

---

## 🔗 Useful Links

- **Live Site:** https://mediverseai.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/Meidverse/Mediverse-AI-assistant

---

**Need help?** Check `ENV_SETUP.md` for detailed setup instructions.
