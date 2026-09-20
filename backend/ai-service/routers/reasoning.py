"""Router — Reasoning engine endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.reasoning import ReasoningRequest, ReasoningResponse
from reasoning.engine import reason

router = APIRouter(prefix="/reasoning", tags=["Reasoning"])


@router.post("/reason", response_model=ReasoningResponse,
             summary="Apply a reasoning strategy to answer a question")
def apply_reasoning(request: ReasoningRequest) -> ReasoningResponse:
    """
    Reasoning strategies available:
    - chain_of_thought: step-by-step reasoning (default)
    - react: Thought → Action → Observation loop
    - self_consistency: run N passes, pick majority answer
    - tree_of_thought: explore multiple reasoning branches
    - few_shot / zero_shot: GPT-4o with or without examples
    """
    try:
        return reason(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/strategies", summary="List all available reasoning strategies")
def list_strategies() -> dict:
    return {
        "strategies": [
            {"id": "chain_of_thought", "description": "Step-by-step sequential reasoning"},
            {"id": "react",            "description": "Thought/Action/Observation loop"},
            {"id": "self_consistency", "description": "Multiple CoT paths, majority vote"},
            {"id": "tree_of_thought",  "description": "Branch exploration with backtracking"},
            {"id": "few_shot",         "description": "Reasoning with provided examples"},
            {"id": "zero_shot",        "description": "Direct answer without examples"},
        ]
    }
