from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class MedicalQueryRequest(BaseModel):
    query: str = Field(..., min_length=10, max_length=1000)
    include_sources: bool = True
    language: str = Field("en", min_length=2, max_length=5)


class MedicalQueryResponse(BaseModel):
    query: str
    response: str
    confidence_score: float
    sources: List[str]
    disclaimer: str
    timestamp: datetime


class HealthCheck(BaseModel):
    status: str
    version: str
    timestamp: datetime
