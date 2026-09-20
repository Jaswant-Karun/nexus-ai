"""Schemas for Reranking module."""

from __future__ import annotations

from pydantic import BaseModel, Field


class RerankRequest(BaseModel):
    query:     str
    documents: list[str]
    top_k:     int  = 5
    model:     str  = "rerank-english-v3.0"   # Cohere reranker
    return_documents: bool = True


class RankedDocument(BaseModel):
    index:         int
    document:      str
    relevance_score: float
    rank:          int


class RerankResponse(BaseModel):
    query:    str
    results:  list[RankedDocument]
    model:    str
    top_k:    int


class CrossEncoderRerankRequest(BaseModel):
    query:     str
    documents: list[str]
    top_k:     int = 5
    model:     str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
