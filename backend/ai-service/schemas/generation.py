from __future__ import annotations

from pydantic import BaseModel, Field


class GenerationRequest(BaseModel):
    prompt: str
    context: list[str] = Field(default_factory=list)
    model: str = "nexus-chat"
    temperature: float = 0.2


class GenerationResponse(BaseModel):
    model: str
    answer: str
    tokens_used: int
    confidence: float
    source: str


class EmbeddingRequest(BaseModel):
    text: str
    model: str = "nexus-embed"


class EmbeddingResponse(BaseModel):
    model: str
    vector: list[float]
    dimensions: int