"""Router — Reranking endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.reranking import (
    CrossEncoderRerankRequest, RerankRequest, RerankResponse,
)
from reranking.reranker import rerank_with_cohere, rerank_with_cross_encoder

router = APIRouter(prefix="/reranking", tags=["Reranking"])


@router.post("/cohere", response_model=RerankResponse,
             summary="Rerank documents using Cohere Rerank API")
def cohere_rerank(request: RerankRequest) -> RerankResponse:
    """
    Uses Cohere rerank-english-v3.0 for high-quality relevance reranking.
    Falls back to BM25-style term overlap if COHERE_API_KEY is not set.
    """
    try:
        return rerank_with_cohere(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/cross-encoder", response_model=RerankResponse,
             summary="Rerank documents using a local cross-encoder model")
def cross_encoder_rerank(request: CrossEncoderRerankRequest) -> RerankResponse:
    """
    Uses a local HuggingFace cross-encoder (ms-marco-MiniLM-L-6-v2 by default).
    Fully offline — no API key required.
    """
    try:
        return rerank_with_cross_encoder(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
