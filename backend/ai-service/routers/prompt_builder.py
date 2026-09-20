"""Router — Prompt Builder endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.prompt_builder import (
    BuildPromptRequest, BuildPromptResponse,
    OptimizePromptRequest, OptimizePromptResponse,
)
from prompt_builder.builder import build_prompt, optimize_prompt, TEMPLATE_LIBRARY

router = APIRouter(prefix="/prompt-builder", tags=["Prompt Builder"])


@router.post("/build", response_model=BuildPromptResponse,
             summary="Build a prompt from a template + variables")
def build(request: BuildPromptRequest) -> BuildPromptResponse:
    """
    Renders a Jinja2 template with provided variables.
    Supports built-in templates: rag_qa, code_review, summarise_doc,
    agent_system, chain_of_thought — or provide your own inline template.
    """
    try:
        return build_prompt(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/optimize", response_model=OptimizePromptResponse,
             summary="Use GPT-4o-mini to optimise a prompt for accuracy/speed/cost")
def optimize(request: OptimizePromptRequest) -> OptimizePromptResponse:
    try:
        return optimize_prompt(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/templates", summary="List all built-in prompt templates")
def list_templates() -> dict:
    return {
        "templates": [
            {
                "name":        t.name,
                "description": t.description,
                "variables":   t.variables,
                "tags":        t.tags,
            }
            for t in TEMPLATE_LIBRARY.values()
        ]
    }
