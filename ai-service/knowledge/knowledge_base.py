"""
NEXUS AI Service — Knowledge Base
Manages structured knowledge: ingestion, indexing, querying, and versioning.
Backed by in-process vector index with optional Qdrant persistence.
"""

from __future__ import annotations

import hashlib
import time
from dataclasses import dataclass, field
from typing import Any

import numpy as np
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

_embed_cache: dict[str, list[float]] = {}


def _embed(text: str) -> list[float]:
    if text in _embed_cache:
        return _embed_cache[text]
    resp  = client.embeddings.create(model="text-embedding-3-small", input=[text])
    vec   = resp.data[0].embedding
    _embed_cache[text] = vec
    return vec


@dataclass
class KnowledgeEntry:
    id:         str
    title:      str
    content:    str
    source:     str  = ""
    tags:       list[str] = field(default_factory=list)
    metadata:   dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=time.time)
    embedding:  list[float] | None = None

    def chunk_count(self) -> int:
        return max(1, len(self.content.split()) // 150)


class KnowledgeBase:
    """In-process knowledge base with semantic search."""

    def __init__(self, name: str = "default"):
        self.name    = name
        self._store: list[KnowledgeEntry] = []

    def add(self, title: str, content: str,
            source: str = "", tags: list[str] | None = None,
            metadata: dict | None = None) -> str:
        entry_id = hashlib.md5(f"{title}{content[:100]}".encode()).hexdigest()[:16]
        embedding = _embed(f"{title} {content[:500]}")
        self._store.append(KnowledgeEntry(
            id=entry_id, title=title, content=content,
            source=source, tags=tags or [], metadata=metadata or {},
            embedding=embedding,
        ))
        return entry_id

    def search(self, query: str, top_k: int = 5,
               tag_filter: str | None = None) -> list[dict]:
        q_vec   = _embed(query)
        q_terms = set(query.lower().split())
        items   = self._store
        if tag_filter:
            items = [e for e in items if tag_filter in e.tags]

        scored = []
        for e in items:
            vec_s  = self._cosine(q_vec, e.embedding or [])
            bm25_s = len(q_terms & set(e.content.lower().split())) / max(len(q_terms), 1)
            scored.append((0.7 * vec_s + 0.3 * bm25_s, e))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [
            {"id": e.id, "title": e.title, "content": e.content[:500],
             "score": round(s, 6), "source": e.source, "tags": e.tags}
            for s, e in scored[:top_k]
        ]

    def get(self, entry_id: str) -> KnowledgeEntry | None:
        return next((e for e in self._store if e.id == entry_id), None)

    def delete(self, entry_id: str) -> bool:
        before = len(self._store)
        self._store = [e for e in self._store if e.id != entry_id]
        return len(self._store) < before

    def stats(self) -> dict:
        return {
            "name":    self.name,
            "entries": len(self._store),
            "chunks":  sum(e.chunk_count() for e in self._store),
        }

    @staticmethod
    def _cosine(a: list[float], b: list[float]) -> float:
        if not a or not b:
            return 0.0
        va, vb = np.array(a, np.float32), np.array(b, np.float32)
        return float(np.dot(va, vb) / (np.linalg.norm(va) * np.linalg.norm(vb) + 1e-8))
