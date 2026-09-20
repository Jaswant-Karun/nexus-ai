"""NEXUS AI — Memory Agent. Uses shared LLM client for summarisation."""
from __future__ import annotations
import hashlib, os, sys, time
from collections import deque
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import simple as _simple

class MemoryItem:
    def __init__(self, id: str, content: str, memory_type: str = "episodic",
                 importance: float = 0.5, metadata: dict | None = None):
        self.id = id; self.content = content; self.memory_type = memory_type
        self.importance = importance; self.metadata = metadata or {}
        self.created_at = time.time(); self.access_count = 0
    def to_dict(self) -> dict:
        return {"id":self.id,"content":self.content,"type":self.memory_type,
                "importance":self.importance,"created_at":self.created_at,
                "access_count":self.access_count,"metadata":self.metadata}

class MemoryAgent:
    def __init__(self, max_working: int = 20, max_long_term: int = 500):
        self.working: deque[MemoryItem] = deque(maxlen=max_working)
        self.long_term: list[MemoryItem] = []; self.max_lt = max_long_term

    def store(self, content: str, memory_type: str = "episodic", importance: float = 0.5, metadata: dict | None = None) -> str:
        item = MemoryItem(id=hashlib.md5(f"{content}{time.time()}".encode()).hexdigest()[:12],
                          content=content, memory_type=memory_type, importance=importance, metadata=metadata)
        self.working.append(item)
        if importance >= 0.6: self._to_long_term(item)
        return item.id

    def _to_long_term(self, item: MemoryItem) -> None:
        if len(self.long_term) >= self.max_lt:
            self.long_term.sort(key=lambda x: x.importance); self.long_term.pop(0)
        self.long_term.append(item)

    def recall(self, query: str, top_k: int = 5, memory_type: str | None = None) -> list[dict]:
        all_items = list(self.working) + self.long_term
        if memory_type: all_items = [m for m in all_items if m.memory_type == memory_type]
        q_words = set(query.lower().split())
        scored  = [(len(q_words & set(m.content.lower().split())) / max(len(q_words),1) * 0.6 + m.importance * 0.4, m)
                   for m in all_items]
        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, m in scored[:top_k]:
            m.access_count += 1
            results.append({**m.to_dict(), "relevance_score": round(score, 4)})
        return results

    def summarise(self, limit: int = 10) -> str:
        recent = list(self.working)[-limit:]
        if not recent: return "No memories available."
        text    = "\n".join(f"- {m.content}" for m in recent)
        ans, _  = _simple(f"Summarise these memory entries concisely:\n{text}")
        return ans

    def forget(self, memory_id: str) -> bool:
        before = len(self.long_term)
        self.long_term = [m for m in self.long_term if m.id != memory_id]
        return len(self.long_term) < before

    def clear_working(self) -> None: self.working.clear()
    def stats(self) -> dict:
        return {"working_count":len(self.working),"long_term_count":len(self.long_term),
                "total":len(self.working)+len(self.long_term)}
