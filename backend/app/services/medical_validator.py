import logging
import re
from typing import Dict, List

logger = logging.getLogger(__name__)


class MedicalValidator:
    """Validate incoming medical questions and wrap responses with safety guidance."""

    EMERGENCY_MESSAGE = (
        "This appears to be an emergency. Please contact your local emergency services (e.g., 911) "
        "or visit the nearest emergency department immediately."
    )

    def __init__(self) -> None:
        self.dangerous_keywords = {
            "suicide",
            "self-harm",
            "overdose",
            "emergency",
            "chest pain",
            "stroke",
            "heart attack",
            "unconscious",
            "bleeding heavily",
            "can't breathe",
        }
        self.disclaimer = (
            "⚠️ MEDICAL DISCLAIMER: This information is for educational purposes only and should not replace "
            "professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare "
            "provider for questions about a medical condition."
        )

    def validate_query(self, query: str) -> Dict[str, object]:
        """Ensure the query can be safely answered by the assistant."""

        if not query:
            return {
                "valid": False,
                "reason": "empty",
                "message": "A medical query is required."
            }

        normalized = query.lower()
        for keyword in self.dangerous_keywords:
            if keyword in normalized:
                logger.warning("Emergency keyword detected in query.")
                return {
                    "valid": False,
                    "reason": "emergency",
                    "message": self.EMERGENCY_MESSAGE,
                }

        if len(normalized) < 10:
            return {
                "valid": False,
                "reason": "too_short",
                "message": "Please provide more detail about your medical concern so we can help responsibly.",
            }

        return {"valid": True}

    def add_safety_wrapper(self, response: str) -> str:
        """Return response without appending disclaimer (handled in frontend)."""
        # Disclaimer removed to prevent repetitive warnings - shown once in UI
        return response

    def detect_medication_mentions(self, text: str) -> List[str]:
        """Return medication-like terms to support downstream moderation."""

        medication_pattern = r"\b[A-Z][a-z]+(?:in|ol|am|ine|ate|ide)\b"
        medications = re.findall(medication_pattern, text or "")
        unique_medications = sorted(set(medications))
        if unique_medications:
            logger.debug("Detected medications: %s", unique_medications)
        return unique_medications
