from __future__ import annotations

from hashlib import sha256

from schemas.generation import EmbeddingRequest, EmbeddingResponse, GenerationRequest, GenerationResponse


def build_generation_response(request: GenerationRequest) -> GenerationResponse:
    answer = request.prompt.strip()
    if request.context:
      context_summary = "; ".join(request.context[:3])
      answer = f"{answer} | context: {context_summary}"

    token_count = max(12, len(request.prompt.split()) * 2)
    confidence = min(0.98, 0.72 + len(request.context) * 0.04)

    return GenerationResponse(
        model=request.model,
        answer=answer,
        tokens_used=token_count,
        confidence=round(confidence, 2),
        source="nexus-ai-service",
    )


def build_embedding_response(request: EmbeddingRequest) -> EmbeddingResponse:
    digest = sha256(request.text.encode("utf-8")).digest()
    vector = [round(byte / 255.0, 4) for byte in digest[:12]]

    return EmbeddingResponse(
        model=request.model,
        vector=vector,
        dimensions=len(vector),
    )