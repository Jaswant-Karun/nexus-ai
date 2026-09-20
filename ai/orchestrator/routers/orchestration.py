from __future__ import annotations

from fastapi import APIRouter

from schemas.orchestration import OrchestrationPlan, OrchestrationRequest
from services.orchestration_service import build_orchestration_plan

router = APIRouter(prefix="/orchestrations", tags=["orchestration"])


@router.post("/plan", response_model=OrchestrationPlan)
def plan(request: OrchestrationRequest) -> OrchestrationPlan:
    return build_orchestration_plan(request)