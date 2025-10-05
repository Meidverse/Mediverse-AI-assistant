import asyncio
import hashlib
import json
import logging
from typing import Any, Dict, Optional

from app.config import get_settings
from app.services.medical_validator import MedicalValidator
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_google_genai import (ChatGoogleGenerativeAI, HarmBlockThreshold,
                                    HarmCategory)
from langchain_openai import ChatOpenAI

try:
    import redis.asyncio as redis
except ImportError:  # pragma: no cover
    redis = None

logger = logging.getLogger(__name__)


class MedicalAIService:
    """Orchestrate LLM responses with safety controls and caching."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.validator = MedicalValidator()
        self.llm = self._initialize_llm()
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            input_key="query",
        )
        self.prompt = self._create_prompt()
        self._redis = self._create_redis_client()

    def _create_prompt(self) -> PromptTemplate:
        template = (
            "You are Mediverse, an expert medical AI assistant. Provide comprehensive, detailed, accurate, and safe medical information.\n\n"
            "IMPORTANT GUIDELINES:\n"
            "1. Provide DETAILED and COMPREHENSIVE responses - the medical field requires thorough explanations\n"
            "2. Include specific medical terminology with explanations for clarity\n"
            "3. Always include a disclaimer that you're not a replacement for professional medical advice\n"
            "4. Never diagnose conditions definitively - provide differential diagnoses when appropriate\n"
            "5. Recommend consulting healthcare professionals for serious concerns\n"
            "6. Provide evidence-based information with specific details when possible\n"
            "7. Be empathetic, professional, and thorough in your explanations\n"
            "8. Include relevant details about:\n"
            "   - Symptoms and their significance\n"
            "   - Possible causes and mechanisms\n"
            "   - Diagnostic approaches\n"
            "   - Treatment options (when relevant)\n"
            "   - Preventive measures\n"
            "   - When to seek immediate medical attention\n\n"
            "Context from medical sources: {search_context}\n\n"
            "Chat History: {chat_history}\n\n"
            "User Query: {query}\n\n"
            "Provide a detailed, comprehensive medical response:"
        )
        return PromptTemplate(input_variables=["search_context", "chat_history", "query"], template=template)

    def _initialize_llm(self):
        provider = (self.settings.LLM_PROVIDER or "gemini").lower()

        if provider == "openrouter":
            if not self.settings.OPENROUTER_API_KEY:
                raise ValueError("OPENROUTER_API_KEY must be set when LLM_PROVIDER=openrouter")

            default_headers = {}
            if self.settings.OPENROUTER_SITE_URL:
                default_headers["HTTP-Referer"] = self.settings.OPENROUTER_SITE_URL
            if self.settings.OPENROUTER_APP_NAME:
                default_headers["X-Title"] = self.settings.OPENROUTER_APP_NAME

            return ChatOpenAI(
                model=self.settings.OPENROUTER_MODEL,
                openai_api_key=self.settings.OPENROUTER_API_KEY,
                openai_api_base=self.settings.OPENROUTER_BASE_URL.rstrip("/"),
                temperature=0.5,  # Slightly higher for more detailed, natural responses
                max_tokens=self.settings.MAX_RESPONSE_LENGTH,
                default_headers=default_headers or None,
            )

        return ChatGoogleGenerativeAI(
            model=self.settings.GEMINI_MODEL,
            google_api_key=self.settings.GEMINI_API_KEY,
            temperature=0.5,  # Slightly higher for more comprehensive responses
            max_output_tokens=self.settings.MAX_RESPONSE_LENGTH,
        )

    def _get_expert_llm(self):
        """Get expert-level model via OpenRouter."""
        if not self.settings.OPENROUTER_API_KEY:
            logger.warning("OPENROUTER_API_KEY not set, falling back to Gemini")
            return self.llm
        
        default_headers = {}
        if self.settings.OPENROUTER_SITE_URL:
            default_headers["HTTP-Referer"] = self.settings.OPENROUTER_SITE_URL
        if self.settings.OPENROUTER_APP_NAME:
            default_headers["X-Title"] = self.settings.OPENROUTER_APP_NAME

        return ChatOpenAI(
            model=self.settings.OPENROUTER_MODEL,
            openai_api_key=self.settings.OPENROUTER_API_KEY,
            openai_api_base=self.settings.OPENROUTER_BASE_URL.rstrip("/"),
            temperature=0.5,  # Balanced for detailed expert analysis
            max_tokens=self.settings.MAX_RESPONSE_LENGTH,
            default_headers=default_headers or None,
        )

    def _create_redis_client(self) -> Optional[Any]:
        if not redis:
            return None
        try:
            return redis.from_url(self.settings.REDIS_URL, encoding="utf-8", decode_responses=True)
        except Exception as exc:  # pragma: no cover
            logger.warning("Could not initialize Redis for AI caching: %s", exc)
            return None

    async def generate_response(
        self, 
        query: str, 
        search_context: Optional[str] = None,
        mode: str = "quick"
    ) -> Dict[str, Any]:
        """
        Generate AI response based on mode:
        - quick: Fast Gemini responses
        - deep_search: With web search context
        - expert: Using OpenRouter powerful models
        """
        # Select appropriate model based on mode
        if mode == "expert":
            llm = self._get_expert_llm()
        elif mode == "deep_search":
            llm = self.llm  # Use default Gemini
            search_context = search_context or "No additional context available"
        else:  # quick mode
            llm = self.llm
            search_context = "No additional context available"
        
        cache_key = self._cache_key(query, search_context or "", mode)
        cached = await self._fetch_cache(cache_key)
        if cached:
            logger.debug("Returning cached AI response for query: %s", query)
            return cached

        chain = LLMChain(llm=llm, prompt=self.prompt, memory=self.memory, verbose=False)

        try:
            result = await chain.ainvoke({"query": query, "search_context": search_context})
            response = result.get("text", "") if isinstance(result, dict) else str(result)
        except Exception as exc:  # pragma: no cover - external API
            logger.error("LLM generation failed: %s", exc)
            raise

        confidence_score = self._calculate_confidence(response, search_context)
        model_identifier = getattr(self.llm, "model", None) or getattr(self.llm, "model_name", "unknown")
        payload = {
            "response": response,
            "confidence_score": confidence_score,
            "model_used": model_identifier,
            "medications_detected": self.validator.detect_medication_mentions(response),
        }
        await self._persist_cache(cache_key, payload)
        return payload

    def _calculate_confidence(self, response: str, context: Optional[str]) -> float:
        score = 0.5
        medical_keywords = ["symptom", "treatment", "diagnosis", "medication", "condition", "therapy"]
        response_lower = (response or "").lower()
        for keyword in medical_keywords:
            if keyword in response_lower:
                score += 0.05

        if context and context != "No additional context available":
            score += 0.2

        return min(score, 0.95)

    def _cache_key(self, query: str, context: str, mode: str = "quick") -> str:
        payload = json.dumps({"query": query, "context": context[:200], "mode": mode}, sort_keys=True)
        digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        return f"{self.settings.CACHE_NAMESPACE}:ai:{digest}"

    async def _fetch_cache(self, key: str) -> Optional[Dict[str, Any]]:
        if not self._redis:
            return None
        try:
            cached = await self._redis.get(key)
            if cached:
                return json.loads(cached)
        except Exception as exc:  # pragma: no cover
            logger.debug("AI cache fetch failed: %s", exc)
        return None

    async def _persist_cache(self, key: str, payload: Dict[str, Any]) -> None:
        if not self._redis:
            return
        try:
            await self._redis.setex(key, self.settings.CACHE_TTL_SECONDS, json.dumps(payload))
        except Exception as exc:  # pragma: no cover
            logger.debug("AI cache persist failed: %s", exc)

    async def analyze_medical_image(
        self, 
        query: str, 
        image_base64: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze medical imaging with multimodal AI (Gemini Pro Vision or GPT-4 Vision).
        
        Args:
            query: User's question or clinical context
            image_base64: Base64 encoded image data (optional)
            
        Returns:
            Dictionary with response and confidence score
        """
        try:
            # Use Gemini Pro Vision for image analysis
            import google.generativeai as genai
            
            genai.configure(api_key=self.settings.GEMINI_API_KEY)
            model = genai.GenerativeModel(self.settings.GEMINI_MODEL)
            
            # Create comprehensive medical imaging analysis prompt
            imaging_prompt = f"""You are Mediverse, an expert medical imaging AI assistant with advanced diagnostic capabilities.

IMPORTANT: You are analyzing medical scans for educational and preliminary assessment purposes only.

Clinical Context: {query}

Please provide a COMPREHENSIVE and DETAILED analysis of this medical image including:

1. **TECHNICAL QUALITY ASSESSMENT:**
   - Image quality and clarity
   - Positioning and technique
   - Any limitations affecting interpretation

2. **DETAILED ANATOMICAL OBSERVATIONS:**
   - Normal anatomical structures visible
   - Bone density and alignment (if applicable)
   - Soft tissue appearance
   - Organ morphology and size
   - Vascular patterns (if visible)

3. **SPECIFIC FINDINGS:**
   - Abnormalities detected with precise locations
   - Size, shape, and characteristics of any lesions
   - Density/intensity patterns
   - Comparison with normal anatomy
   - Degree of severity (mild, moderate, severe)

4. **DIFFERENTIAL DIAGNOSES:**
   - Most likely diagnoses with reasoning
   - Alternative possibilities to consider
   - Red flags or urgent findings

5. **CLINICAL CORRELATION:**
   - How findings relate to patient symptoms
   - What additional clinical information would help
   - Relevant medical history considerations

6. **RECOMMENDED NEXT STEPS:**
   - Additional imaging modalities needed
   - Laboratory tests to consider
   - Follow-up imaging timeline
   - Specialist referrals if appropriate

7. **EMERGENCY INDICATORS:**
   - Any findings requiring immediate attention
   - Time-sensitive observations

CRITICAL DISCLAIMERS:
- This is a preliminary AI analysis, NOT a definitive diagnosis
- All findings MUST be verified by board-certified radiologists/physicians
- Urgent/emergency cases require IMMEDIATE professional evaluation
- Do not rely solely on this assessment for medical decisions
- This analysis is for educational and screening purposes only

Provide your analysis in a clear, structured, professional medical format with specific details."""

            # Generate response
            if image_base64:
                # Decode base64 image
                import base64
                from io import BytesIO

                from PIL import Image
                
                image_bytes = base64.b64decode(image_base64)
                image = Image.open(BytesIO(image_bytes))
                
                response = model.generate_content([imaging_prompt, image])
            else:
                # Text-only query (fallback to standard medical AI)
                response = model.generate_content(imaging_prompt)
            
            # Extract and process response
            if response and response.text:
                ai_response = response.text
                
                # Calculate confidence score based on response quality
                confidence = self._calculate_confidence(ai_response, query)
                
                return {
                    "response": ai_response,
                    "confidence_score": confidence,
                }
            else:
                return {
                    "response": "I apologize, but I couldn't generate a complete analysis. Please ensure the image is clear and try again, or consult a healthcare professional.",
                    "confidence_score": 0.0,
                }
                
        except Exception as e:
            logger.error(f"Error in medical image analysis: {e}")
            return {
                "response": f"I encountered an error while analyzing the image: {str(e)}. Please try again or consult a radiologist for professional evaluation.",
                "confidence_score": 0.0,
            }
