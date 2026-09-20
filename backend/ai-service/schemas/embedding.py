"""Schemas for Embedding module."""

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class EmbedModel(str, Enum):
    OPENAI_SMALL  = "text-embedding-3-small"
    OPENAI_LARGE  = "text-embedding-3-large"
    ADA_002       = "text-embedding-ada-002"
    LOCAL_MINILM  = "all-MiniLM-L6-v2"
    LOCAL_MPNET   = "all-mpnet-base-v2"


class EmbedRequest(BaseModel):
    texts:  list[str]
    model:  EmbedModel = EmbedModel.OPENAI_SMALL
    normalize: bool = True


class EmbedResponse(BaseModel):
    model:      str
    embeddings: list[list[float]]
    dimensions: int
    token_count: int


class SimilarityRequest(BaseModel):
    text_a: str
    text_b: str
    model:  EmbedModel = EmbedModel.OPENAI_SMALL


class SimilarityResponse(BaseModel):
    text_a:     str
    text_b:     str
    score:      float          # cosine similarity 0–1
    model:      str


class BatchEmbedRequest(BaseModel):
    texts:      list[str]
    model:      EmbedModel = EmbedModel.OPENAI_SMALL
    batch_size: int = 100
