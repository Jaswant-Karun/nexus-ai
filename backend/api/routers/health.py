from __future__ import annotations

from fastapi import APIRouter

from schemas.health import HealthResponse
from services.health_service import build_health_response

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=HealthResponse)
def read_health() -> HealthResponse:
	return build_health_response()


@router.get("/ready")
def read_readiness() -> dict[str, str]:
	return {"status": "ready"}
