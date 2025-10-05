# 🔐 IMPORTANT: Environment Variables for Vercel

## ⚠️ NEVER commit API keys or credentials to Git!

All sensitive credentials should be added as **Environment Variables** in your Vercel Dashboard.

---

## How to Add Environment Variables in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project: **mediverseai**
3. Click **Settings** → **Environment Variables**
4. Add each variable below

---

## Required Environment Variables:

### 🔴 Critical (App won't work without these):

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
SECRET_KEY=generate_random_32_character_string
```

### 🟡 Optional (For additional features):

```bash
# Database (if using Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require

# Redis Cache (if using Redis Cloud)
REDIS_URL=redis://default:your_password@redis-xxxxx.redns.redis-cloud.com:17423

# Tavily API (for Deep Search mode)
TAVILY_API_KEY=tvly-dev-your_actual_key_here

# Groq API (for alternative LLM)
GROQ_API_KEY=your_groq_api_key_here

# OpenRouter API (for Expert mode)
OPENROUTER_API_KEY=your_openrouter_key_here
```

---

## How to Generate SECRET_KEY:

### On Windows (PowerShell):
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### On Linux/Mac:
```bash
openssl rand -hex 32
```

### Online:
Visit: https://generate-secret.vercel.app/32

---

## Current Configuration:

The `api/index.py` file uses **safe defaults**:
- `DATABASE_URL` → SQLite (in-memory, for serverless)
- `REDIS_URL` → localhost (disabled in serverless)
- `TAVILY_API_KEY` → empty (deep search disabled)

These defaults allow the app to run without errors, but:
- ✅ Quick Consult mode - **Works** (needs GEMINI_API_KEY)
- ✅ Image Analysis mode - **Works** (needs GEMINI_API_KEY)
- ❌ Deep Search mode - **Disabled** (needs TAVILY_API_KEY)
- ⚠️ Expert mode - **Limited** (needs GROQ_API_KEY or OPENROUTER_API_KEY)

---

## After Adding Environment Variables:

1. Vercel will **automatically redeploy** your app
2. Wait for deployment to complete
3. Test all 4 modes to verify they work

---

## Security Best Practices:

✅ **DO**:
- Add secrets to Vercel Environment Variables
- Use `.env.local` for local development (already in `.gitignore`)
- Rotate API keys periodically

❌ **DON'T**:
- Commit API keys to Git
- Share credentials in screenshots/logs
- Use production credentials in development

---

## Your API Keys Were Exposed!

⚠️ **IMPORTANT**: You had these credentials in your code:

1. **Supabase Database**: `db.qdhyixgysckfiwopwbif.supabase.co`
   - Password: `nIKSHAY@1212`
   - **Action**: Change this password in Supabase dashboard immediately!

2. **Redis Cloud**: `redis-17423.c305.ap-south-1-1.ec2.redns.redis-cloud.com`
   - Password: `NlhoveX5lX9bVWP11REM3jX64m0f8wxu`
   - **Action**: Regenerate this password in Redis Cloud dashboard!

3. **Tavily API**: `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`
   - **Action**: Regenerate this API key in Tavily dashboard!

I've removed them from the code, but you should **regenerate all these credentials** since they were visible.

---

## Next Steps:

1. ✅ Regenerate exposed credentials (Supabase, Redis, Tavily)
2. ✅ Add new credentials to Vercel Environment Variables
3. ✅ Add GEMINI_API_KEY to Vercel
4. ✅ Generate and add SECRET_KEY to Vercel
5. ✅ Test deployment after environment variables are added

---

**Last Updated**: October 6, 2025
