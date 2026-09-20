"""Router — Recommendation engine endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.recommendation import RecommendRequest, RecommendResponse
from recommendation.recommender import recommend

router = APIRouter(prefix="/recommendation", tags=["Recommendation"])


@router.post("/recommend", response_model=RecommendResponse,
             summary="Semantic embedding-based item recommendation")
def get_recommendations(request: RecommendRequest) -> RecommendResponse:
    """
    Ranks items by cosine similarity of their embeddings to the query.
    Supports strategies: embedding (default), collaborative, hybrid.
    Returns top-k items with relevance scores and reasons.
    """
    try:
        return recommend(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
