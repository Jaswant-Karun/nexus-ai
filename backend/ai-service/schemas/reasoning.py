"""Schemas for Reasoning module."""

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class ReasoningStrategy(str, Enum):
    CHAIN_OF_THOUGHT = "chain_of_thought"
    TREE_OF_THOUGHT  = "tree_of_thought"
    REACT            = "react"
    ZERO_SHOT        = "zero_shot"
    FEW_SHOT         = "few_shot"
    SELF_CONSISTENCY = "self_consistency"


class ReasoningStep(BaseModel):
    step_number: int
    type:        str          # "thought" | "action" | "observation" | "conclusion"
    content:     str
    confidence:  float = 1.0


class ReasoningRequest(BaseModel):
    question:     str
    context:      list[str] = Field(default_factory=list)
    strategy:     ReasoningStrategy = ReasoningStrategy.CHAIN_OF_THOUGHT
    examples:     list[dict] = Field(default_factory=list)
    num_paths:    int  = 3         # for tree-of-thought / self-consistency
    model:        str  = "gpt-4o"
    temperature:  float = 0.2


class ReasoningResponse(BaseModel):
    question:    str
    strategy:    str
    steps:       list[ReasoningStep]
    final_answer: str
    confidence:  float
    tokens_used: int
    model:       str
    alternative_answers: list[str] = Field(default_factory=list)
