from __future__ import annotations

from fastapi import APIRouter

from schemas.model import ModelRequest, ModelResponse
from services.model_router import complete_model_request


router = APIRouter(prefix="/models", tags=["models"])


@router.post("/complete", response_model=ModelResponse)
def complete_model(request: ModelRequest) -> ModelResponse:
	return complete_model_request(request)