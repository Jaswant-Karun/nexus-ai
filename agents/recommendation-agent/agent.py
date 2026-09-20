"""
NEXUS AI — Recommendation Agent
Provides semantic embedding-based recommendations with LLM-generated
explanations and confidence scores.
"""

from __future__ import annotations

import os
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


def _embed(texts: list[str]) -> list[list[float]]:
    resp = client.embeddings.create(model="text-embedding-3-small", input=texts)
    return [d.embedding for d in resp.data]


def _cosine(a: list[float], b: list[float]) -> float:
    va, vb = np.array(a, dtype=np.float32), np.array(b, dtype=np.float32)
    return float(np.dot(va, vb) / (np.linalg.norm(va) * np.linalg.norm(vb) + 1e-8))


class RecommendationAgent:
    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model

    def recommend(self, query: str, items: list[str],
                  ids: list[str] | None = None,
                  metadata: list[dict] | None = None,
                  top_k: int = 5) -> dict:
        """Rank items by semantic similarity to query."""
        if not items:
            return {"query": query, "recommendations": [],
                    "agent": "recommendation-agent"}

        all_texts = [query] + items
        embeddings = _embed(all_texts)
        q_vec      = embeddings[0]
        item_vecs  = embeddings[1:]

        scored = sorted(
            enumerate(item_vecs),
            key=lambda x: _cosine(q_vec, x[1]),
            reverse=True,
        )[:top_k]

        recs = []
        for rank, (idx, _) in enumerate(scored):
            score = _cosine(q_vec, item_vecs[idx])
            recs.append({
                "rank":     rank + 1,
                "id":       ids[idx] if ids else str(idx),
                "text":     items[idx],
                "score":    round(score, 6),
                "reason":   f"Semantic similarity {score:.1%} to query",
                "metadata": metadata[idx] if metadata else {},
            })

        return {
            "agent":           "recommendation-agent",
            "query":           query,
            "total_candidates": len(items),
            "recommendations": recs,
        }

    def explain(self, query: str, item: str) -> str:
        """Generate a natural-language explanation for why an item is relevant."""
        resp = client.chat.completions.create(
            model=self.model,
            messages=[{
                "role": "user",
                "content": (
                    f"In 1-2 sentences, explain why this item is relevant to the query.\n"
                    f"Query: {query}\nItem: {item}"
                ),
            }],
            temperature=0.3,
        )
        return resp.choices[0].message.content or ""


def run(query: str, items: list[str], top_k: int = 5) -> dict:
    return RecommendationAgent().recommend(query, items, top_k=top_k)
