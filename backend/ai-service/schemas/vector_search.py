"""Schemas for Vector Search module."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class IndexRequest(BaseModel):
    collection: str
    documents:  list[str]
    metadata:   list[dict[str, Any]] = Field(default_factory=list)
    ids:        list[str]            = Field(default_factory=list)
    embed_model: str = "text-embedding-3-small"


class IndexResponse(BaseModel):
    collection:  str
    indexed:     int
    failed:      int
    ids:         list[str]


class SearchRequest(BaseModel):
    collection:   str
    query:        str
    top_k:        int   = 5
    score_threshold: float = 0.0
    embed_model:  str   = "text-embedding-3-small"
    filters:      dict[str, Any] = Field(default_factory=dict)


class SearchHit(BaseModel):
    id:       str
    score:    float
    text:     str
    metadata: dict[str, Any] = Field(default_factory=dict)


class SearchResponse(BaseModel):
    query:       str
    collection:  str
    hits:        list[SearchHit]
    total:       int


class HybridSearchRequest(BaseModel):
    collection:    str
    query:         str
    top_k:         int   = 5
    bm25_weight:   float = 0.3
    vector_weight: float = 0.7
    embed_model:   str   = "text-embedding-3-small"


class DeleteRequest(BaseModel):
    collection: str
    ids:        list[str]
