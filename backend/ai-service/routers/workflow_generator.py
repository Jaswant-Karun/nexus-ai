"""Router — Workflow Generator endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.workflow import (
    WorkflowGenerateRequest, WorkflowGenerateResponse,
    WorkflowOptimizeRequest,
)
from workflow_generator.generator import generate_workflow, optimize_workflow

router = APIRouter(prefix="/workflow-generator", tags=["Workflow Generator"])


@router.post("/generate", response_model=WorkflowGenerateResponse,
             summary="Generate a workflow DAG from a natural-language goal")
def generate(request: WorkflowGenerateRequest) -> WorkflowGenerateResponse:
    """
    Uses GPT-4o to design an optimal multi-agent workflow DAG.
    Returns nodes (trigger, agent, action, condition, output, transform, api_call)
    and edges with labels and conditions — ready to import into the
    NEXUS AI Workflow Builder UI.
    """
    try:
        return generate_workflow(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/optimize", response_model=WorkflowGenerateResponse,
             summary="Optimise an existing workflow for speed, cost, or accuracy")
def optimize(request: WorkflowOptimizeRequest) -> WorkflowGenerateResponse:
    """
    Analyses an existing workflow structure and restructures it
    to optimise for the given goal (speed / cost / accuracy).
    """
    try:
        return optimize_workflow(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
