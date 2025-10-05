import asyncio
import time
from collections import defaultdict, deque
from typing import Deque, DefaultDict, Optional

from fastapi import HTTPException, Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import get_settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory rate limiting per client IP address."""

    def __init__(self, app, calls: Optional[int] = None, period: int = 60) -> None:
        super().__init__(app)
        settings = get_settings()
        self.calls = calls or settings.RATE_LIMIT_PER_MINUTE
        self.period = period
        self._lock = asyncio.Lock()
        self._requests: DefaultDict[str, Deque[float]] = defaultdict(lambda: deque(maxlen=self.calls))

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "anonymous"
        now = time.time()

        async with self._lock:
            window = self._requests[client_ip]
            while window and now - window[0] > self.period:
                window.popleft()

            if len(window) >= self.calls:
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded. Please slow down and try again shortly.",
                )

            window.append(now)

        response = await call_next(request)
        return response
