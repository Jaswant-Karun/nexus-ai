"""Schemas for Explainability module."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ExplainRequest(BaseModel):
    prediction:   Any
    input_data:   dict[str, Any]
    model_name:   str  = "unknown"
    method:       str  = "lime"      # "lime" | "shap" | "attention" | "gradient"
    num_features: int  = 10
    llm_explain:  bool = True        # also generate natural language explanation
    llm_model:    str  = "gpt-4o"


class FeatureImportance(BaseModel):
    feature:     str
    value:       Any
    importance:  float
    direction:   str      # "positive" | "negative" | "neutral"
    description: str


class ExplainResponse(BaseModel):
    prediction:   Any
    method:       str
    explanation:  str           # natural language
    features:     list[FeatureImportance]
    confidence:   float
    model_name:   str
    tokens_used:  int


class AttentionExplainRequest(BaseModel):
    text:      str
    question:  str
    model:     str = "gpt-4o"


class AttentionExplainResponse(BaseModel):
    text:       str
    question:   str
    answer:     str
    highlights: list[dict[str, Any]]    # [{token, weight}]
    explanation: str
