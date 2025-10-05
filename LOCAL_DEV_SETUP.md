# Local Development Setup

## Quick Start - Use Deployed API (Easiest)

✅ **Already configured!** Your `.env.local` file points to the deployed Vercel API.

1. **Restart your Next.js dev server:**
   ```bash
   # Press Ctrl+C to stop current server
   npm run dev
   ```

2. **Visit:** http://localhost:3000

3. **The frontend will use the deployed API at:** https://mediverseai.vercel.app/api

---

## Alternative - Run Backend Locally

If you want to develop/test backend changes locally:

### Step 1: Setup Backend Environment

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create `.env` file:**
   ```bash
   copy .env.example .env
   ```

3. **Edit `backend/.env` and add your API keys:**
   ```env
   GEMINI_API_KEY=your_actual_key_here
   SECRET_KEY=generate_random_32_chars
   ```

### Step 2: Install Python Dependencies

```bash
# Make sure you're in the backend directory
pip install -r requirements.txt
```

### Step 3: Run Backend Server

```bash
# From backend directory
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Update Frontend to Use Local Backend

Edit `.env.local` in project root:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Step 5: Run Frontend

```bash
# From project root
npm run dev
```

---

## Current Status

🟢 **Frontend**: Running at http://localhost:3000 (Fast Refresh working)

🔴 **Backend**: Two options:
- Option 1 (Recommended): Use deployed Vercel API - **Already configured!**
- Option 2: Run locally at http://localhost:8000 - Follow steps above

---

## Environment Variables Reference

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - API endpoint (Vercel or localhost)

### Backend (backend/.env)
- `GEMINI_API_KEY` - **Required** for AI responses
- `SECRET_KEY` - **Required** for security
- `GROQ_API_KEY` - Optional, for alternative LLM
- `TAVILY_API_KEY` - Optional, for deep search mode
- `OPENROUTER_API_KEY` - Optional, for expert mode

---

## Troubleshooting

### "ERR_CONNECTION_REFUSED" to localhost:8000
- **Solution**: Either:
  1. Use deployed API (already configured in `.env.local`)
  2. Start local backend server (see steps above)

### "Failed to load favicon.svg"
- **Minor issue** - Create favicon or ignore, doesn't affect functionality

### API returns 401/403
- **Check**: Environment variables are set in Vercel Dashboard
- **Add**: GEMINI_API_KEY and SECRET_KEY in Vercel Settings

---

## Next Steps

1. **Restart Next.js dev server** to load `.env.local`
2. **Test the app** - Should now connect to Vercel API
3. **Check browser console** - No more connection errors

If using Vercel API, make sure you've added the environment variables in your Vercel Dashboard!
