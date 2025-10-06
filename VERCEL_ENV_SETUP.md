# Vercel Environment Variables Setup

## 🔑 Required Environment Variables

To enable AI functionality in your Mediverse deployment, you need to add these environment variables to Vercel:

### 1. **GEMINI_API_KEY** (Required)
- **Description**: Google Gemini AI API key for medical analysis
- **Get it from**: https://aistudio.google.com/apikey
- **Example**: `AIzaSyB...` (starts with AIza)

### 2. **SECRET_KEY** (Required)
- **Description**: Secret key for session security
- **Generate**: Run `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- **Example**: Any random 32+ character string

### 3. **TAVILY_API_KEY** (Optional - for Deep Search mode)
- **Description**: Tavily API for web search in Deep Search mode
- **Get it from**: https://app.tavily.com/
- **Example**: `tvly-...`

---

## 📋 Step-by-Step Setup

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your **mediverseai** project

### Step 2: Navigate to Environment Variables
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar

### Step 3: Add Each Variable
For each variable above:
1. Click **Add New** button
2. **Key**: Enter the variable name (e.g., `GEMINI_API_KEY`)
3. **Value**: Paste the API key or secret value
4. **Environment**: Select **Production**, **Preview**, and **Development** (all three)
5. Click **Save**

### Step 4: Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋮** (three dots) menu
4. Click **Redeploy**
5. Check **Use existing Build Cache** (optional, faster)
6. Click **Redeploy**

---

## ✅ Minimal Setup (Just AI Chat)

If you only want basic AI chat functionality to work:

```
GEMINI_API_KEY=<your-gemini-api-key>
SECRET_KEY=<any-random-32-char-string>
```

That's it! The app will work with just these two.

---

## 🧪 Test After Deployment

Once deployed, test the API:

```bash
# Test health endpoint
curl https://mediverseai.vercel.app/api/health

# Test AI analysis
curl -X POST https://mediverseai.vercel.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"query": "What is paracetamol used for?", "mode": "quick"}'
```

You should see an AI-generated response!

---

## 🔒 Security Notes

1. **Never commit API keys to Git**
2. The old exposed keys (Supabase, Redis, Tavily) should be regenerated if they were public
3. Vercel environment variables are encrypted at rest
4. Only add keys to Vercel dashboard, never in code

---

## 📊 Current Deployment Status

- **Frontend**: ✅ Working (Next.js)
- **Backend API**: ✅ Working (Python serverless)
- **AI Integration**: ⏳ Waiting for GEMINI_API_KEY
- **Health Check**: ✅ https://mediverseai.vercel.app/api/health

---

## 🚀 What Happens After Adding Keys

1. Your chat will respond with actual medical AI analysis
2. All 4 modes will work:
   - 🩺 **Quick Consult**: Fast medical answers
   - 📸 **Image Analysis**: Medical scan analysis
   - 🔬 **Deep Search**: Research-backed comprehensive analysis
   - 👨‍⚕️ **Expert Mode**: Clinical-grade differential diagnoses

3. The error message "I couldn't analyze that scan" will be replaced with real AI responses

---

## ❓ Troubleshooting

### "Gemini AI not configured" error
- ✅ Check GEMINI_API_KEY is added to Vercel
- ✅ Verify the key is valid at https://aistudio.google.com/apikey
- ✅ Make sure you redeployed after adding the key

### Still getting placeholder responses
- ✅ Wait 1-2 minutes after redeployment
- ✅ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- ✅ Check Vercel deployment logs for errors

### Need help?
Check deployment logs at: https://vercel.com/meidverse/mediverseai/deployments
