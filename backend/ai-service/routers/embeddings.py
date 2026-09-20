"""Router — Embedding endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.embedding import (
    BatchEmbedRequest, EmbedRequest, EmbedResponse,
    SimilarityRequest, SimilarityResponse,
)
from embeddings.openai_embedder import embed_request, similarity_request

router = APIRouter(prefix="/embeddings", tags=["Embeddings"])


@router.post("/embed", response_model=EmbedResponse,
             summary="Generate embeddings for a list of texts")
def create_embeddings(request: EmbedRequest) -> EmbedResponse:
    """
    Generate dense vector embeddings using OpenAI text-embedding-3-small/large.
    Results are cached by sha256(model+text) for efficiency.
    """
    try:
        return embed_request(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/similarity", response_model=SimilarityResponse,
             summary="Compute cosine similarity between two texts")
def compute_similarity(request: SimilarityRequest) -> SimilarityResponse:
    """Returns cosine similarity score 0.0–1.0 between text_a and text_b."""
    try:
        return similarity_request(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/models", summary="List available embedding models")
def list_models() -> dict:
    return {
        "models": [
            {"id": "text-embedding-3-small", "dims": 1536, "provider": "openai", "recommended": True},
            {"id": "text-embedding-3-large", "dims": 3072, "provider": "openai"},
            {"id": "text-embedding-ada-002", "dims": 1536, "provider": "openai", "legacy": True},
            {"id": "all-MiniLM-L6-v2",       "dims": 384,  "provider": "local"},
            {"id": "all-mpnet-base-v2",       "dims": 768,  "provider": "local"},
        ]
    }
