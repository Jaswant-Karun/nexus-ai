"""
NEXUS AI Service — AI Controller
HTTP-level request handlers that validate input, call service layer,
and format responses. Follows FastAPI router dependency injection pattern.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

router = APIRouter(prefix="/ai", tags=["AI Controller"])


class GenerateRequest(BaseModel):
    prompt:      str
    model:       str  = "gpt-4o"
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    max_tokens:  int   = Field(2048, ge=1, le=32768)
    stream:      bool  = False


class GenerateResponse(BaseModel):
    content:    str
    model:      str
    tokens_used: int
    finish_reason: str = "stop"


class EmbedRequest(BaseModel):
    texts: list[str]
    model: str = "text-embedding-3-small"


class EmbedResponse(BaseModel):
    embeddings: list[list[float]]
    model:      str
    dimensions: int
    tokens_used: int


@router.post("/generate", response_model=GenerateResponse,
             summary="Generate a completion from any LLM")
async def generate(req: GenerateRequest) -> GenerateResponse:
    """Unified LLM generation endpoint supporting GPT-4o, Claude, Gemini."""
    try:
        import os
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
        resp   = client.chat.completions.create(
            model=req.model,
            messages=[{"role": "user", "content": req.prompt}],
            temperature=req.temperature,
            max_tokens=req.max_tokens,
        )
        return GenerateResponse(
            content=resp.choices[0].message.content or "",
            model=req.model,
            tokens_used=resp.usage.total_tokens if resp.usage else 0,
            finish_reason=resp.choices[0].finish_reason or "stop",
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/embed", response_model=EmbedResponse,
             summary="Generate embeddings for a list of texts")
async def embed(req: EmbedRequest) -> EmbedResponse:
    try:
        import os
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
        resp   = client.embeddings.create(model=req.model, input=req.texts)
        vecs   = [d.embedding for d in resp.data]
        return EmbedResponse(
            embeddings=vecs,
            model=req.model,
            dimensions=len(vecs[0]) if vecs else 0,
            tokens_used=resp.usage.total_tokens if resp.usage else 0,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/models", summary="List available model IDs")
async def list_models() -> dict[str, Any]:
    return {
        "models": [
            {"id": "gpt-4o",              "provider": "openai",    "context": 128000},
            {"id": "gpt-4o-mini",         "provider": "openai",    "context": 128000},
            {"id": "claude-3-5-sonnet",   "provider": "anthropic", "context": 200000},
            {"id": "gemini-1.5-pro",      "provider": "google",    "context": 1000000},
            {"id": "text-embedding-3-small", "provider": "openai", "dims": 1536},
        ]
    }
