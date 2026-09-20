"""Schemas for Prompt Builder module."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class PromptTemplate(BaseModel):
    name:        str
    template:    str
    variables:   list[str] = Field(default_factory=list)
    description: str = ""
    tags:        list[str] = Field(default_factory=list)


class BuildPromptRequest(BaseModel):
    template_name: str = ""
    template:      str = ""          # inline template if template_name empty
    variables:     dict[str, Any] = Field(default_factory=dict)
    system_context: str = ""
    examples:      list[dict[str, str]] = Field(default_factory=list)
    max_tokens:    int = 4096


class BuildPromptResponse(BaseModel):
    prompt:        str
    system:        str
    token_estimate: int
    template_used:  str
    variables_used: dict[str, Any]


class OptimizePromptRequest(BaseModel):
    prompt:        str
    task:          str
    target_model:  str = "gpt-4o"
    optimize_for:  str = "accuracy"   # "accuracy" | "speed" | "cost"


class OptimizePromptResponse(BaseModel):
    original_prompt:  str
    optimized_prompt: str
    improvements:     list[str]
    token_reduction:  int
    model:            str
