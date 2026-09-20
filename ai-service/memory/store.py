"""
NEXUS AI Service — Memory Store
Persistent and in-memory storage for agent conversation history,
episodic memories, and working context.
"""

from __future__ import annotations

import hashlib
import json
import time
from collections import defaultdict
from typing import Any

# ── In-process stores ──────────────────────────────────────────────────────────
_conversations: dict[str, list[dict]] = defaultdict(list)
_episodic:      list[dict]            = []
_semantic:      dict[str, Any]        = {}


# ── Conversation memory ────────────────────────────────────────────────────────
def save_message(session_id: str, role: str, content: str,
                 metadata: dict | None = None) -> str:
    msg_id = hashlib.md5(f"{session_id}{time.time()}".encode()).hexdigest()[:12]
    _conversations[session_id].append({
        "id":         msg_id,
        "role":       role,
        "content":    content,
        "metadata":   metadata or {},
        "created_at": time.time(),
    })
    return msg_id


def get_history(session_id: str, last_n: int = 50) -> list[dict]:
    return _conversations[session_id][-last_n:]


def clear_session(session_id: str) -> None:
    _conversations.pop(session_id, None)


def get_context_window(session_id: str, max_tokens: int = 4000) -> list[dict]:
    """Return recent messages that fit within token budget (1 token ≈ 4 chars)."""
    budget  = max_tokens * 4
    history = get_history(session_id)
    window: list[dict] = []
    used    = 0
    for msg in reversed(history):
        size = len(msg["content"])
        if used + size > budget:
            break
        window.insert(0, msg)
        used += size
    return window


# ── Episodic memory ────────────────────────────────────────────────────────────
def store_episodic(content: str, importance: float = 0.5,
                   tags: list[str] | None = None) -> str:
    mem_id = hashlib.md5(f"{content}{time.time()}".encode()).hexdigest()[:12]
    _episodic.append({
        "id":         mem_id,
        "content":    content,
        "importance": importance,
        "tags":       tags or [],
        "created_at": time.time(),
        "access_count": 0,
    })
    return mem_id


def search_episodic(query: str, top_k: int = 5) -> list[dict]:
    q_words = set(query.lower().split())
    scored  = []
    for m in _episodic:
        m_words = set(m["content"].lower().split())
        score   = len(q_words & m_words) / max(len(q_words), 1) * 0.6 + m["importance"] * 0.4
        scored.append((score, m))
    scored.sort(key=lambda x: x[0], reverse=True)
    results = []
    for score, m in scored[:top_k]:
        m["access_count"] += 1
        results.append({**m, "relevance": round(score, 4)})
    return results


# ── Semantic / key-value memory ────────────────────────────────────────────────
def remember(key: str, value: Any) -> None:
    _semantic[key] = {"value": value, "stored_at": time.time()}


def recall(key: str) -> Any | None:
    entry = _semantic.get(key)
    return entry["value"] if entry else None


def forget(key: str) -> bool:
    return bool(_semantic.pop(key, None))


def stats() -> dict:
    return {
        "conversations":  len(_conversations),
        "total_messages": sum(len(v) for v in _conversations.values()),
        "episodic_count": len(_episodic),
        "semantic_keys":  len(_semantic),
    }
