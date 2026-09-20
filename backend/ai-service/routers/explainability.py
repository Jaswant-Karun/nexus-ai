"""Router — AI Explainability endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.explainability import (
    AttentionExplainRequest, AttentionExplainResponse,
    ExplainRequest, ExplainResponse,
)
from explainability.explainer import explain, attention_explain

router = APIRouter(prefix="/explainability", tags=["Explainability"])


@router.post("/explain", response_model=ExplainResponse,
             summary="Explain an AI prediction with feature importances")
def explain_prediction(request: ExplainRequest) -> ExplainResponse:
    """
    Generate LIME-style feature importances for any model prediction.
    Optionally produces a natural-language GPT-4o explanation.
    """
    try:
        return explain(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/attention", response_model=AttentionExplainResponse,
             summary="Highlight which tokens drove the model's answer")
def explain_with_attention(request: AttentionExplainRequest) -> AttentionExplainResponse:
    """
    Given a text + question, identify which words/phrases were most important
    for the model's answer using attention-style explanation.
    """
    try:
        return attention_explain(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
