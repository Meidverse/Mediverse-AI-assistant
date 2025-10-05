# Mediverse AI - Medical Imaging Diagnostics

## 🩺 Overview

Mediverse AI is an advanced medical imaging analysis chatbot powered by multimodal AI (Gemini Pro Vision). Upload X-rays, CT scans, MRIs, and get instant AI-powered diagnostic insights.

## ✨ New Features

### 🖼️ Medical Image Upload
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Supported Formats**: JPG, PNG, DICOM
- **File Size**: Up to 10MB
- **Instant Preview**: See your uploaded scan before analysis

### 💬 Chat-Based Diagnostics
- **Conversational Interface**: Describe symptoms and context via chat
- **Real-time Analysis**: Get AI responses in seconds
- **Confidence Scoring**: Each analysis includes a confidence percentage
- **Message History**: Review past conversations and analyses

### 🎨 Liquid Glass UI Design
- **Glassmorphism Effects**: Modern frosted glass aesthetic
- **Smooth Animations**: Framer Motion powered transitions
- **AI-Themed Visuals**: Blue-purple gradient color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the new imaging-focused landing page.

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
pip install python-multipart pillow google-generativeai

# Set your API key
echo "GEMINI_API_KEY=your_key_here" >> .env

# Run the server
uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`

## 🏗️ Architecture

### Frontend Components

1. **ImageUpload.tsx** - Medical scan upload with drag-drop
2. **ChatInterface.tsx** - Main chat UI with message history
3. **page.tsx** - Landing page focused on imaging AI

### Backend Endpoints

- `POST /api/v1/analyze` - Multimodal image + text analysis
  - Accepts: `multipart/form-data`
  - Fields: `query` (text), `image` (file, optional)
  - Returns: AI analysis with confidence score

- `POST /api/v1/query` - Text-only medical queries (existing)
- `GET /api/v1/history` - Query history (existing)

### AI Models

- **Gemini 1.5 Flash**: Primary vision model for image analysis
- **Gemini Pro**: Text-based medical queries
- **OpenRouter**: Alternative multi-model support

## 📋 Usage Example

### Upload & Analyze a Medical Scan

1. **Open the App**: Navigate to `http://localhost:3000`
2. **Click Photo Icon**: Opens the image upload panel
3. **Upload Scan**: Drag-drop or browse for X-ray/CT/MRI
4. **Describe Symptoms**: Type clinical context (e.g., "Patient complains of chest pain")
5. **Send**: Click send button to analyze
6. **Review Results**: AI provides diagnostic insights with confidence score

### API Usage

```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -F "query=Analyze this chest X-ray for pneumonia" \
  -F "image=@/path/to/xray.jpg"
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Trust, medical professionalism
- **Secondary**: Purple (#8b5cf6) - Innovation, AI technology
- **Accent**: Indigo (#6366f1) - Highlights and CTAs
- **Background**: Dark slate (#020617) - Low eye strain

### Animations
- **Typing Effect**: AI responses appear character-by-character
- **Pulse Glow**: Important UI elements have subtle glow
- **Slide Transitions**: Smooth message entrance/exit
- **Scan Lines**: Futuristic scanning effects on workflow cards

### Glassmorphism
- **Backdrop Blur**: 32px blur for depth
- **Border Glow**: Subtle gradient borders on hover
- **Shadow Layers**: Multi-layer shadows for 3D effect
- **Transparency**: 40-85% opacity for glass effect

## ⚠️ Medical Disclaimer

**IMPORTANT**: Mediverse AI provides preliminary analysis for educational and informational purposes only. 

- **Not a Diagnosis**: AI analysis is NOT a substitute for professional medical evaluation
- **Verification Required**: All findings must be confirmed by licensed radiologists/physicians
- **Emergency Cases**: Seek immediate medical attention for urgent conditions
- **Liability**: Do not make medical decisions based solely on AI analysis

## 🔒 Security & Privacy

- **HIPAA Compliant Infrastructure**: Encrypted data transmission
- **No Data Storage**: Images are processed in memory and discarded
- **Audit Logging**: All queries logged for quality assurance
- **Secure API**: Rate limiting and input validation

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **React Dropzone**: File upload handling
- **Headless UI**: Accessible components

### Backend
- **FastAPI**: High-performance Python API
- **Gemini Pro Vision**: Google's multimodal AI
- **Pillow**: Image processing
- **Redis**: Response caching
- **PostgreSQL**: Query history storage

## 📦 Dependencies

### New Frontend Packages
```json
{
  "react-dropzone": "^14.2.3",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.5",
  "@radix-ui/react-dialog": "^1.1.4",
  "@radix-ui/react-scroll-area": "^1.2.2",
  "@radix-ui/react-avatar": "^1.1.2"
}
```

### New Backend Packages
```
python-multipart==0.0.6
pillow==11.3.0
google-generativeai==0.3.2
```

## 🧪 Testing

### Test Image Analysis
```bash
# Run backend tests
cd backend
pytest tests/test_medical_ai.py -v

# Test image endpoint
cd backend
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -F "query=Test query" \
  -F "image=@test_xray.jpg"
```

### Frontend Development
```bash
cd frontend
npm run dev    # Development server
npm run build  # Production build
npm run lint   # TypeScript & ESLint check
```

## 🚧 Future Enhancements

- [ ] DICOM file parsing and viewer
- [ ] Multi-image comparison (before/after scans)
- [ ] 3D volume rendering for CT/MRI stacks
- [ ] Integration with PACS systems
- [ ] Multi-language support
- [ ] Voice input for clinical notes
- [ ] PDF report generation
- [ ] Annotation tools for radiologists

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## 📞 Support

- **Documentation**: [docs.mediverse.ai](https://docs.mediverse.ai)
- **Issues**: [GitHub Issues](https://github.com/mediverse/medical-ai-assistant/issues)
- **Email**: support@mediverse.ai

---

**Built with ❤️ for advancing medical diagnostics through AI**
