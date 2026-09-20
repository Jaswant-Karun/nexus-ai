"""NEXUS AI — Search Agent. Uses shared LLM client + keyword/cosine search."""
from __future__ import annotations
import os, sys
from dataclasses import dataclass, field
from typing import Any
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm

@dataclass
class SearchResult:
    id: str; text: str; score: float; metadata: dict[str, Any] = field(default_factory=dict)

def _bm25_score(query: str, doc: str) -> float:
    q_terms = set(query.lower().split())
    d_terms = doc.lower().split()
    tf = sum(d_terms.count(w) for w in q_terms) / max(len(d_terms), 1)
    return tf * len(q_terms & set(d_terms)) / max(len(q_terms), 1)

class SearchAgent:
    def __init__(self, model: str = "gpt-4o"):
        self.model = model

    def search(self, query: str, documents: list[str], ids: list[str] | None = None,
               metadata: list[dict] | None = None, top_k: int = 5) -> list[SearchResult]:
        scored = []
        for i, doc in enumerate(documents):
            score = _bm25_score(query, doc)
            scored.append((score, SearchResult(id=ids[i] if ids else str(i), text=doc,
                           score=round(score,6), metadata=metadata[i] if metadata else {})))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [r for _, r in scored[:top_k]]

    def answer(self, query: str, documents: list[str], top_k: int = 5) -> dict:
        hits = self.search(query, documents, top_k=top_k)
        if not hits:
            return {"query":query,"answer":"No relevant documents found.","hits":[],"agent":"search-agent"}
        context = "\n\n".join(f"[Result {i+1}] (score={h.score:.3f})\n{h.text[:600]}" for i,h in enumerate(hits))
        ans, tok = _llm([{"role":"system","content":"Answer the query using ONLY the search results. Cite [Result N]."},
                         {"role":"system","content":f"Search results:\n{context}"},
                         {"role":"user","content":query}], model=self.model, temperature=0.1)
        return {"agent":"search-agent","query":query,"answer":ans,
                "hits":[{"id":h.id,"score":h.score,"text":h.text[:200]} for h in hits],"tokens_used":tok}

def run(query: str, documents: list[str], top_k: int = 5) -> dict:
    return SearchAgent().answer(query, documents, top_k)
