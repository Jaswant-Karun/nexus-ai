"""Schemas for Summarizer module."""

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class SummarizeStrategy(str, Enum):
    EXTRACTIVE   = "extractive"
    ABSTRACTIVE  = "abstractive"
    STUFF        = "stuff"          # fit everything in one prompt
    MAP_REDUCE   = "map_reduce"     # summarize chunks, then combine
    REFINE       = "refine"         # iteratively refine


class SummarizeRequest(BaseModel):
    text:        str
    strategy:    SummarizeStrategy = SummarizeStrategy.ABSTRACTIVE
    max_length:  int   = 300        # words
    min_length:  int   = 50
    bullet_points: bool = False
    language:    str   = "en"
    focus:       str   = ""         # optional focus topic
    model:       str   = "gpt-4o"


class SummarizeResponse(BaseModel):
    summary:      str
    bullet_points: list[str] = Field(default_factory=list)
    keywords:     list[str]
    word_count:   int
    compression_ratio: float
    strategy:     str
    model:        str
    tokens_used:  int


class BatchSummarizeRequest(BaseModel):
    documents: list[str]
    strategy:  SummarizeStrategy = SummarizeStrategy.MAP_REDUCE
    model:     str = "gpt-4o-mini"


class DocumentSummary(BaseModel):
    index:       int
    summary:     str
    keywords:    list[str]
    word_count:  int


class BatchSummarizeResponse(BaseModel):
    summaries:    list[DocumentSummary]
    combined_summary: str
    total_tokens: int
