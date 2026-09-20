from __future__ import annotations

from fastapi import APIRouter

from schemas.orchestration import OrchestrationRequest, OrchestrationResponse, SolutionReport
from services.orchestration_service import build_orchestration, execute_orchestration, generate_solution_report


router = APIRouter(prefix="/orchestration", tags=["orchestration"])


@router.post("/plan", response_model=OrchestrationResponse)
def create_orchestration_plan(request: OrchestrationRequest) -> OrchestrationResponse:
	return build_orchestration(request)


@router.post("/execute", response_model=OrchestrationResponse)
def execute_agent_council(request: OrchestrationRequest) -> OrchestrationResponse:
	return execute_orchestration(request)


@router.post("/report", response_model=SolutionReport)
def create_solution_report(request: OrchestrationRequest) -> SolutionReport:
	return generate_solution_report(request)