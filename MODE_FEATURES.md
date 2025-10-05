# Mediverse AI - Multiple AI Modes

## 🚀 New Features

Mediverse now supports **4 different AI modes** to provide flexible medical assistance:

### 1. ⚡ Quick Consult (Default)
- **Model**: Gemini 2.5 Flash
- **Speed**: Fastest
- **Use Case**: Quick medical questions, general consultations
- **Image Support**: No
- **Web Search**: No

### 2. 📷 Image Analysis
- **Model**: Gemini 2.5 Flash (Vision)
- **Speed**: Fast
- **Use Case**: Medical imaging analysis (X-rays, CT scans, MRI, etc.)
- **Image Support**: **Yes - Required**
- **Web Search**: No
- **Features**:
  - Upload medical scans
  - AI-powered image analysis
  - Detailed findings and differential diagnoses
  - Radiologist-level preliminary assessment

### 3. 🔍 Deep Search
- **Model**: Gemini 2.5 Flash
- **Speed**: Moderate
- **Use Case**: In-depth medical research questions
- **Image Support**: Optional
- **Web Search**: **Yes** (Tavily API)
- **Features**:
  - Web-based medical research
  - Evidence-based information
  - Current medical literature
  - Comprehensive context

### 4. 🧠 Expert Mode
- **Model**: Meta Llama 3.1 70B (via OpenRouter)
- **Speed**: Slower (more thorough)
- **Use Case**: Complex medical questions requiring deep reasoning
- **Image Support**: No
- **Web Search**: No
- **Features**:
  - Most powerful model
  - Advanced medical reasoning
  - Complex case analysis
  - Detailed explanations

## 📱 How to Use

1. **Open Mediverse** at http://localhost:3000
2. **Select a Mode** - Click one of the 4 mode buttons at the bottom
3. **Enter Your Question** - Type your medical query
4. **Upload Image** (Optional for Image Mode):
   - Click the camera icon in header OR
   - Click "Image Analysis" mode button
   - Drag & drop or select image
5. **Send** - Get AI-powered medical insights!

## 🔑 API Keys Required

- **GEMINI_API_KEY**: For Quick, Image, and Deep Search modes ✅
- **TAVILY_API_KEY**: For Deep Search web research ✅
- **OPENROUTER_API_KEY**: For Expert mode ✅

All keys are already configured in your `.env` file!

## 🎨 UI Features

- **Mode Selection Buttons**: Interactive buttons with visual feedback
- **Active Mode Indicator**: Blue gradient border on selected mode
- **Image Preview**: Shows uploaded image before sending
- **Confidence Scores**: AI provides confidence in analysis
- **Mode-Specific Disclaimers**: Appropriate warnings for each mode

## 🏗️ Technical Implementation

### Backend Changes
- `endpoints.py`: Added `mode` parameter to `/analyze` endpoint
- `ai_service.py`: 
  - Added `_get_expert_llm()` method for OpenRouter
  - Modified `generate_response()` to accept mode parameter
  - Updated cache keys to include mode
- Mode routing logic for different AI workflows

### Frontend Changes
- `ChatInterface.tsx`:
  - Added `selectedMode` state
  - 4 mode selection buttons with icons
  - FormData includes mode parameter
  - Auto-trigger image upload when Image Analysis selected

## 📊 Mode Comparison

| Feature | Quick | Image | Deep Search | Expert |
|---------|-------|-------|-------------|--------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡ | 🐢 |
| Image Analysis | ❌ | ✅ | ✅ | ❌ |
| Web Research | ❌ | ❌ | ✅ | ❌ |
| Model Power | Medium | Medium | Medium | High |
| Best For | Quick Q&A | Scans | Research | Complex |

## 🔒 Safety Features

All modes include:
- Medical disclaimers
- Safety wrappers
- Validation checks
- Professional consultation recommendations

## 🚧 Future Enhancements

- [ ] Add more models via OpenRouter
- [ ] Allow custom model selection
- [ ] Save mode preferences
- [ ] Mode-specific conversation history
- [ ] Hybrid modes (e.g., Image + Deep Search)
