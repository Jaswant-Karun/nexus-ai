"""Embedding-based semantic recommendation engine."""

from __future__ import annotations

import os

import numpy as np
from openai import OpenAI

from schemas.recommendation import RecommendItem, RecommendRequest, RecommendResponse

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


def _embed_batch(texts: list[str], model: str) -> list[list[float]]:
    if not texts:
        return []
    resp = _client.embeddings.create(model=model, input=texts)
    return [d.embedding for d in resp.data]


def _cosine(a: list[float], b: list[float]) -> float:
    va = np.array(a, dtype=np.float32)
    vb = np.array(b, dtype=np.float32)
    return float(np.dot(va, vb) /
                 (np.linalg.norm(va) * np.linalg.norm(vb) + 1e-8))


def recommend(req: RecommendRequest) -> RecommendResponse:
    if not req.item_texts:
        return RecommendResponse(query=req.query, items=[],
                                 strategy=req.strategy, model=req.embed_model,
                                 total_candidates=0)

    # Embed query + all items in one batch
    all_texts  = [req.query] + req.item_texts
    embeddings = _embed_batch(all_texts, req.embed_model)

    query_vec  = embeddings[0]
    item_vecs  = embeddings[1:]

    # Score each item
    scored: list[tuple[float, int]] = []
    for i, vec in enumerate(item_vecs):
        score = _cosine(query_vec, vec)
        scored.append((score, i))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[:req.top_k]

    items: list[RecommendItem] = []
    for rank, (score, idx) in enumerate(top):
        item_id  = req.item_ids[idx]  if idx < len(req.item_ids)  else str(idx)
        metadata = req.item_metadata[idx] if idx < len(req.item_metadata) else {}
        items.append(RecommendItem(
            id=item_id,
            text=req.item_texts[idx],
            score=round(score, 6),
            reason=f"Semantic similarity {score:.2%} to query",
            metadata=metadata,
        ))

    return RecommendResponse(
        query=req.query,
        items=items,
        strategy=req.strategy,
        model=req.embed_model,
        total_candidates=len(req.item_texts),
    )
