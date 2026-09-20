"""Schemas for Recommendation module."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class RecommendRequest(BaseModel):
    user_id:      str = ""
    query:        str = ""
    item_ids:     list[str]           = Field(default_factory=list)
    item_texts:   list[str]           = Field(default_factory=list)
    item_metadata: list[dict[str, Any]] = Field(default_factory=list)
    top_k:        int   = 5
    strategy:     str   = "embedding"   # "embedding" | "collaborative" | "hybrid"
    embed_model:  str   = "text-embedding-3-small"


class RecommendItem(BaseModel):
    id:          str
    text:        str
    score:       float
    reason:      str
    metadata:    dict[str, Any] = Field(default_factory=dict)


class RecommendResponse(BaseModel):
    query:        str
    items:        list[RecommendItem]
    strategy:     str
    model:        str
    total_candidates: int
