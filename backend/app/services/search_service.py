import asyncio
import hashlib
import json
import logging
from typing import Any, Dict, Optional

from app.config import get_settings
from tavily import TavilyClient

try:
    import redis.asyncio as redis
except ImportError:  # pragma: no cover - redis is in requirements but keep defensive
    redis = None

logger = logging.getLogger(__name__)


class MedicalSearchService:
    """Proxy around Tavily that enriches prompts with trusted medical sources."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.client = TavilyClient(api_key=self.settings.TAVILY_API_KEY)
        self._redis = self._create_redis_client()

    def _create_redis_client(self) -> Optional[Any]:
        if not redis:
            logger.warning("redis-py not available; disabling caching.")
            return None
        try:
            return redis.from_url(self.settings.REDIS_URL, encoding="utf-8", decode_responses=True)
        except Exception as exc:  # pragma: no cover - only hit when Redis down
            logger.error("Unable to connect to Redis: %s", exc)
            return None

    async def search_medical_info(self, query: str, max_results: int = None) -> Dict[str, object]:
        """Search for medical context, falling back gracefully on errors."""
        
        # Use config default if not specified
        if max_results is None:
            max_results = self.settings.MAX_SEARCH_RESULTS

        cache_key = self._cache_key(query, max_results)
        cached = await self._fetch_cache(cache_key)
        if cached:
            logger.debug("Returning cached search results for query: %s", query)
            return cached

        medical_query = f"medical information {query}"
        try:
            response = await asyncio.to_thread(
                self.client.search,
                medical_query,
                search_depth=self.settings.SEARCH_DEPTH,  # Use config setting
                max_results=max_results,
                include_domains=[
                    "ncbi.nlm.nih.gov",
                    "pubmed.ncbi.nlm.nih.gov",
                    "mayoclinic.org",
                    "webmd.com",
                    "cdc.gov",
                    "who.int",
                    "healthline.com",
                    "medlineplus.gov",
                    "nih.gov",
                    "uptodate.com",
                ],
                exclude_domains=["wikipedia.org"],
            )
        except Exception as exc:  # pragma: no cover - external dependency
            logger.error("Tavily search failed: %s", exc)
            return {"results": [], "context": "", "query": query, "error": str(exc)}

        formatted = self._format_search_results(response)
        await self._persist_cache(cache_key, formatted)
        return formatted

    def _format_search_results(self, response: Dict[str, object]) -> Dict[str, object]:
        results = []
        for result in response.get("results", []):
            results.append(
                {
                    "title": result.get("title"),
                    "content": result.get("content"),
                    "url": result.get("url"),
                    "score": result.get("score", 0),
                }
            )

        # Increased context length for more detailed medical information
        snippets = []
        for formatted in results[:5]:  # Use top 5 results instead of 3
            content = (formatted.get("content") or "")[:1000]  # Increased from 500 to 1000 chars
            snippets.append(f"Source: {formatted.get('title')}\n{content}...")

        return {
            "results": results,
            "context": "\n\n".join(snippets) if snippets else "No additional context available",
            "query": response.get("query", ""),
        }

    def _cache_key(self, query: str, max_results: int) -> str:
        payload = json.dumps({"query": query, "max_results": max_results}, sort_keys=True)
        digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        return f"{self.settings.CACHE_NAMESPACE}:search:{digest}"

    async def _fetch_cache(self, key: str) -> Optional[Dict[str, object]]:
        if not self._redis:
            return None
        try:
            cached = await self._redis.get(key)
            if cached:
                return json.loads(cached)
        except Exception as exc:  # pragma: no cover - external service
            logger.warning("Failed to read from Redis cache: %s", exc)
        return None

    async def _persist_cache(self, key: str, payload: Dict[str, object]) -> None:
        if not self._redis:
            return
        try:
            await self._redis.setex(key, self.settings.CACHE_TTL_SECONDS, json.dumps(payload))
        except Exception as exc:  # pragma: no cover - external service
            logger.warning("Failed to write to Redis cache: %s", exc)
