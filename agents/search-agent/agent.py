"""
NEXUS AI — Search Agent
Semantic and keyword search agent that queries knowledge bases,
ranks results, and generates synthesised answers from search hits.
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from typing import Any
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


@dataclass
class SearchResult:
    id:       str
    text:     str
    score:    float
    metadata: dict[str, Any] = field(default_factory=dict)
    source:   str = ""


def _embed(text: str) -> list[float]:
    resp = client.embeddings.create(model="text-embedding-3-small", input=[text])
    return resp.data[0].embedding


def _cosine(a: list[float], b: list[float]) -> float:
    va, vb = np.array(a, np.float32), np.array(b, np.float32)
    return float(np.dot(va, vb) / (np.linalg.norm(va) * np.linalg.norm(vb) + 1e-8))


class SearchAgent:
    """In-process search with semantic + BM25-style hybrid ranking."""

    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model

    def search(self, query: str, documents: list[str],
               ids: list[str] | None = None,
               metadata: list[dict] | None = None,
               top_k: int = 5,
               mode: str = "hybrid") -> list[SearchResult]:
        """Search documents using hybrid semantic + keyword scoring."""
        if not documents:
            return []

        q_terms = set(query.lower().split())

        # Vector similarity
        q_vec    = _embed(query)
        doc_vecs = [_embed(d) for d in documents]

        results = []
        for i, (doc, dvec) in enumerate(zip(documents, doc_vecs)):
            vec_score  = _cosine(q_vec, dvec)
            bm25_score = len(q_terms & set(doc.lower().split())) / max(len(q_terms), 1)
            final = 0.7 * vec_score + 0.3 * bm25_score if mode == "hybrid" else vec_score
            results.append(SearchResult(
                id=ids[i] if ids else str(i),
                text=doc,
                score=round(final, 6),
                metadata=metadata[i] if metadata else {},
                source=f"doc_{i}",
            ))

        results.sort(key=lambda r: r.score, reverse=True)
        return results[:top_k]

    def answer(self, query: str, documents: list[str],
               top_k: int = 5) -> dict:
        """Search + synthesise an answer from the top results."""
        hits = self.search(query, documents, top_k=top_k)
        if not hits:
            return {"query": query, "answer": "No relevant documents found.",
                    "hits": [], "agent": "search-agent"}

        context = "\n\n".join(
            f"[Result {i+1}] (score={h.score:.3f})\n{h.text[:600]}"
            for i, h in enumerate(hits)
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content":
                    "Answer the query using ONLY the search results provided. "
                    "Cite result numbers inline [Result N]."},
                {"role": "system", "content": f"Search results:\n{context}"},
                {"role": "user",   "content": query},
            ],
            temperature=0.1,
        )
        return {
            "agent":  "search-agent",
            "query":  query,
            "answer": resp.choices[0].message.content,
            "hits":   [{"id": h.id, "score": h.score, "text": h.text[:200]} for h in hits],
            "tokens_used": resp.usage.total_tokens if resp.usage else 0,
        }


def run(query: str, documents: list[str], top_k: int = 5) -> dict:
    return SearchAgent().answer(query, documents, top_k)
