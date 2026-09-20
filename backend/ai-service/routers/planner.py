"""Router — Task Planner endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.planner import PlanRequest, PlanResponse
from planner.task_planner import create_plan

router = APIRouter(prefix="/planner", tags=["Planner"])


@router.post("/plan", response_model=PlanResponse,
             summary="Decompose a goal into an ordered execution plan")
def plan(request: PlanRequest) -> PlanResponse:
    """
    Uses GPT-4o to break a complex goal into subtasks with:
    - Assigned agent roles (analyst, researcher, coder, etc.)
    - Dependency graph (which tasks block others)
    - Priority and token estimates per subtask
    - Optimal execution order
    """
    try:
        return create_plan(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
