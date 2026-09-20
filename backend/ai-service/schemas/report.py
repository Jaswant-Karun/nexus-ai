"""Schemas for Report Generator module."""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class ReportFormat(str, Enum):
    MARKDOWN = "markdown"
    HTML     = "html"
    JSON     = "json"
    PLAIN    = "plain"


class ReportSection(BaseModel):
    title:   str
    content: str
    data:    dict[str, Any] = Field(default_factory=dict)


class ReportRequest(BaseModel):
    title:       str
    data:        dict[str, Any]
    instructions: str  = ""
    sections:    list[str] = Field(default_factory=list)
    format:      ReportFormat = ReportFormat.MARKDOWN
    include_charts: bool = False
    model:       str = "gpt-4o"


class ReportResponse(BaseModel):
    title:       str
    content:     str
    sections:    list[ReportSection]
    format:      str
    word_count:  int
    model:       str
    tokens_used: int


class InsightRequest(BaseModel):
    data:        dict[str, Any]
    focus:       str = ""
    num_insights: int = 5
    model:       str = "gpt-4o"


class InsightResponse(BaseModel):
    insights:    list[str]
    data_summary: str
    model:       str
    tokens_used: int
