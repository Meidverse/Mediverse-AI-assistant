# Environment Variables Setup Guide

## Required Environment Variables for Vercel

Add these environment variables in your Vercel dashboard:

### 🔑 **Required API Keys**

1. **GEMINI_API_KEY**
   - Get from: https://aistudio.google.com/app/apikey
   - Used for: AI-powered medical analysis and chat
   - Example: `AIzaSy...`

2. **TAVILY_API_KEY**
   - Get from: https://tavily.com
   - Used for: Advanced web search for medical information
   - Example: `tvly-...`

3. **SECRET_KEY**
   - Generate a random string (minimum 32 characters)
   - Used for: JWT token encryption
   - Example: `your-super-secret-key-minimum-32-chars-long`

### 🔧 **Optional API Keys**

4. **OPENROUTER_API_KEY** (Optional)
   - Get from: https://openrouter.ai/keys
   - Used for: Alternative LLM provider
   - Leave empty if not using

### ⚙️ **Configuration Settings**

5. **LLM_PROVIDER**
   - Value: `gemini` (default)
   - Options: `gemini` or `openrouter`

6. **GEMINI_MODEL**
   - Value: `models/gemini-2.5-flash`
   - Alternative: `models/gemini-pro-vision`

7. **ENVIRONMENT**
   - Value: `production`

8. **LOG_LEVEL**
   - Value: `INFO`
   - Options: `DEBUG`, `INFO`, `WARNING`, `ERROR`

### 📊 **Optional - Database & Caching**

9. **DATABASE_URL** (Optional)
   - For PostgreSQL database
   - Example: `postgresql://user:pass@host/dbname`

10. **REDIS_URL** (Optional)
    - For caching
    - Example: `redis://host:port`

---

## How to Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Navigate to: https://vercel.com/dashboard
2. Select your project: **Mediverse-AI-assistant**

### Step 2: Open Settings
1. Click on **Settings** tab
2. Select **Environment Variables** from the sidebar

### Step 3: Add Variables
For each variable above:
1. Click **Add New**
2. **Key**: Enter the variable name (e.g., `GEMINI_API_KEY`)
3. **Value**: Enter your API key
4. **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy**

---

## Minimal Setup (Quick Start)

To get started quickly, you only need these 3 variables:

```env
GEMINI_API_KEY=your-gemini-api-key-here
TAVILY_API_KEY=your-tavily-api-key-here
SECRET_KEY=your-random-secret-key-at-least-32-characters
```

---

## Testing Your Deployment

After adding environment variables and redeploying:

1. **Visit your site**: https://mediverseai.vercel.app
2. **Test the chat**: Try asking a medical question
3. **Upload an image**: Test the medical imaging analysis
4. **Check for errors**: Open browser console (F12) for any issues

---

## Troubleshooting

### Error: "API key not found"
- Make sure all required environment variables are added
- Redeploy after adding variables

### Error: "Failed to analyze"
- Check if GEMINI_API_KEY is valid
- Verify API key has Gemini API enabled

### Error: "Search failed"
- Check if TAVILY_API_KEY is valid
- Verify you have remaining search credits

---

## Getting Your API Keys

### 1. Google Gemini API Key
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key

### 2. Tavily API Key
1. Go to: https://tavily.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 3. Generate SECRET_KEY
Run this command to generate a secure key:
```bash
openssl rand -base64 32
```
Or use this online tool: https://randomkeygen.com/

---

## Security Best Practices

✅ **DO:**
- Keep API keys private
- Use different keys for production and development
- Rotate keys regularly
- Monitor API usage

❌ **DON'T:**
- Commit API keys to git
- Share keys publicly
- Use the same key across multiple projects

---

## Need Help?

- 📧 Check Vercel deployment logs for errors
- 🔍 Use browser console to debug frontend issues
- 📝 Review backend logs in Vercel Functions section
