import json
from datetime import datetime
from typing import Any, Dict

import pytest
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


@pytest.fixture(autouse=True)
def stub_external_services(monkeypatch):
    from app.api import endpoints

    async def fake_search(query: str) -> Dict[str, Any]:
        return {
            "results": [
                {
                    "title": "Mock Source",
                    "content": "Example medical content.",
                    "url": "https://example.com",
                    "score": 0.9,
                }
            ],
            "context": "Evidence-based context snippet",
            "query": query,
        }

    async def fake_generate_response(query: str, search_context: str):
        return {
            "response": f"Mock response for: {query}",
            "confidence_score": 0.8,
            "model_used": "gemini-pro",
            "medications_detected": [],
        }

    monkeypatch.setattr(endpoints.search_service, "search_medical_info", fake_search)
    monkeypatch.setattr(endpoints.ai_service, "generate_response", fake_generate_response)
    yield


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "healthy"
    assert body["service"] == "mediverse"
    assert datetime.fromisoformat(body["timestamp"])  # raises if invalid


def test_medical_query():
    payload = {
        "query": "What are the symptoms of the common cold?",
        "include_sources": True,
        "language": "en",
    }
    response = client.post("/api/v1/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == payload["query"]
    assert "Mock response for" in data["response"]
    assert data["confidence_score"] == pytest.approx(0.8, rel=0.01)
    assert data["disclaimer"].startswith("⚠️ MEDICAL DISCLAIMER")
    assert data["sources"] == ["https://example.com"]


def test_emergency_query_validation():
    from app.services.medical_validator import MedicalValidator

    validator = MedicalValidator()
    result = validator.validate_query("I'm having a heart attack")
    assert result["valid"] is False
    assert result["reason"] == "emergency"


def test_search_service(monkeypatch):
    from app.services.search_service import MedicalSearchService

    monkeypatch.setattr(MedicalSearchService, "_create_redis_client", lambda self: None)
    service = MedicalSearchService()

    raw = {
        "results": [
            {
                "title": "Trusted Source",
                "content": "Validated clinical guidance.",
                "url": "https://trusted.org",
                "score": 0.95,
            }
        ],
        "query": "headache treatment",
    }

    results = service._format_search_results(raw)
    assert results["results"][0]["url"] == "https://trusted.org"
    assert "Validated clinical guidance." in results["context"]
    assert results["query"] == "headache treatment"


def test_openrouter_llm_initialization(monkeypatch):
    from app.config import get_settings
    from app.services import ai_service

    monkeypatch.setenv("LLM_PROVIDER", "openrouter")
    monkeypatch.setenv("OPENROUTER_API_KEY", "test-openrouter-key")
    monkeypatch.setenv("OPENROUTER_MODEL", "meta-llama/test")
    monkeypatch.setenv("OPENROUTER_SITE_URL", "https://example.com")
    monkeypatch.setenv("OPENROUTER_APP_NAME", "Test App")

    get_settings.cache_clear()

    captured_kwargs = {}

    class DummyOpenRouter:
        def __init__(self, **kwargs):
            captured_kwargs.update(kwargs)
            self.model_name = kwargs["model"]

    monkeypatch.setattr(ai_service, "ChatOpenAI", DummyOpenRouter)

    try:
        service = ai_service.MedicalAIService()

        assert service.llm.model_name == "meta-llama/test"
        assert captured_kwargs["openai_api_base"].startswith("https://openrouter.ai")
        assert captured_kwargs["default_headers"]["HTTP-Referer"] == "https://example.com"
        assert captured_kwargs["default_headers"]["X-Title"] == "Test App"
    finally:
        get_settings.cache_clear()
