from __future__ import annotations

from fastapi import APIRouter

from schemas.generation import EmbeddingRequest, GenerationRequest, GenerationResponse, EmbeddingResponse
from services.generation_service import build_embedding_response, build_generation_response

router = APIRouter(prefix="/inference", tags=["inference"])


@router.post("/generate", response_model=GenerationResponse)
def generate(request: GenerationRequest) -> GenerationResponse:
    return build_generation_response(request)


@router.post("/embeddings", response_model=EmbeddingResponse)
def create_embeddings(request: EmbeddingRequest) -> EmbeddingResponse:
    return build_embedding_response(request)