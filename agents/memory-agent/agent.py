"""
NEXUS AI — Memory Agent
Manages short-term and long-term memory for multi-turn conversations.
Supports episodic memory, semantic memory, and working memory.
"""

from __future__ import annotations

import hashlib
import json
import os
import time
from collections import deque
from typing import Any

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


class MemoryItem:
    def __init__(self, content: str, memory_type: str = "episodic",
                 importance: float = 0.5, metadata: dict | None = None):
        self.id          = hashlib.md5(f"{content}{time.time()}".encode()).hexdigest()[:12]
        self.content     = content
        self.memory_type = memory_type   # episodic | semantic | procedural | working
        self.importance  = importance    # 0.0 – 1.0
        self.metadata    = metadata or {}
        self.created_at  = time.time()
        self.access_count = 0

    def to_dict(self) -> dict:
        return {
            "id": self.id, "content": self.content, "type": self.memory_type,
            "importance": self.importance, "created_at": self.created_at,
            "access_count": self.access_count, "metadata": self.metadata,
        }


class MemoryAgent:
    """In-process memory store with semantic search via OpenAI embeddings."""

    def __init__(self, max_working: int = 20, max_long_term: int = 500,
                 model: str = "gpt-4o-mini"):
        self.model        = model
        self.working:    deque[MemoryItem] = deque(maxlen=max_working)
        self.long_term:  list[MemoryItem]  = []
        self._embeddings: dict[str, list[float]] = {}   # id → embedding
        self.max_lt       = max_long_term

    # ── Store ────────────────────────────────────────────────────────────────
    def store(self, content: str, memory_type: str = "episodic",
              importance: float = 0.5, metadata: dict | None = None) -> str:
        item = MemoryItem(content, memory_type, importance, metadata)
        self.working.append(item)
        if importance >= 0.6:
            self._to_long_term(item)
        return item.id

    def _to_long_term(self, item: MemoryItem) -> None:
        if len(self.long_term) >= self.max_lt:
            # Evict least important
            self.long_term.sort(key=lambda x: x.importance)
            self.long_term.pop(0)
        self.long_term.append(item)

    # ── Recall ───────────────────────────────────────────────────────────────
    def recall(self, query: str, top_k: int = 5,
               memory_type: str | None = None) -> list[dict]:
        """Recall the most relevant memories using keyword overlap (no Qdrant needed)."""
        all_items = list(self.working) + self.long_term
        if memory_type:
            all_items = [m for m in all_items if m.memory_type == memory_type]

        q_words = set(query.lower().split())
        scored  = []
        for m in all_items:
            m_words  = set(m.content.lower().split())
            overlap  = len(q_words & m_words) / max(len(q_words), 1)
            score    = overlap * 0.6 + m.importance * 0.4
            scored.append((score, m))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, m in scored[:top_k]:
            m.access_count += 1
            results.append({**m.to_dict(), "relevance_score": round(score, 4)})
        return results

    # ── Summarise ─────────────────────────────────────────────────────────────
    def summarise(self, limit: int = 10) -> str:
        """Ask GPT to summarise recent working memory."""
        recent = list(self.working)[-limit:]
        if not recent:
            return "No memories available."
        text = "\n".join(f"- {m.content}" for m in recent)
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Summarise these memory entries concisely:"},
                {"role": "user",   "content": text},
            ],
            temperature=0.2,
        )
        return resp.choices[0].message.content or ""

    def forget(self, memory_id: str) -> bool:
        before = len(self.long_term)
        self.long_term = [m for m in self.long_term if m.id != memory_id]
        return len(self.long_term) < before

    def clear_working(self) -> None:
        self.working.clear()

    def stats(self) -> dict:
        return {
            "working_count":   len(self.working),
            "long_term_count": len(self.long_term),
            "total":           len(self.working) + len(self.long_term),
        }
