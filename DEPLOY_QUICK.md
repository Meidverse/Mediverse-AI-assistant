# ⚡ Quick Vercel Deployment

## 🚀 Deploy in 3 Steps

### 1. Go to Vercel
Visit: [vercel.com/new](https://vercel.com/new)

### 2. Import Repository
- Select: `Meidverse/Mediverse-AI-assistant`
- Framework: **Next.js**
- Root Directory: **Leave as /** (root)

### 3. Add Environment Variables

```env
GEMINI_API_KEY=your-key-here
TAVILY_API_KEY=your-key-here
OPENROUTER_API_KEY=your-key-here
SECRET_KEY=your-secret-key-min-32-chars
NEXT_PUBLIC_API_BASE_URL=/api
```

### 4. Deploy! 🎉

---

## 📖 Full Documentation

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete guide.

---

## 🔧 Build Settings

| Setting | Value |
|---------|-------|
| Build Command | `cd frontend && npm run build` |
| Output Directory | `frontend/.next` |
| Install Command | `cd frontend && npm install` |

---

## ✅ Deployment Checklist

- [ ] Set all environment variables
- [ ] Deploy and wait for build
- [ ] Test frontend at your-app.vercel.app
- [ ] Test API at your-app.vercel.app/health
- [ ] Verify all 4 AI modes work
- [ ] Check sources display in Deep Search

---

## 🆘 Need Help?

Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) or [Vercel Docs](https://vercel.com/docs)
