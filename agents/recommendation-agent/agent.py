"""NEXUS AI — Recommendation Agent. Uses shared LLM client + numpy cosine similarity."""
from __future__ import annotations
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import simple as _simple

def _embed(texts: list[str]) -> list[list[float]]:
    """Use Gemini/Google embedding if available, else simulate with TF-IDF-like approach."""
    try:
        import google.generativeai as genai
        key = os.getenv("GOOGLE_AI_API_KEY","")
        if key:
            genai.configure(api_key=key)
            result = genai.embed_content(model="models/text-embedding-004", content=texts)
            return result["embedding"] if isinstance(texts, str) else [result["embedding"]] if len(texts)==1 else result
    except Exception:
        pass
    # Fallback: simple bag-of-words similarity (no API needed)
    all_words = list({w for t in texts for w in t.lower().split()})
    word_idx  = {w: i for i, w in enumerate(all_words)}
    vecs = []
    for text in texts:
        vec = [0.0] * len(all_words)
        for w in text.lower().split():
            if w in word_idx:
                vec[word_idx[w]] += 1.0
        norm = sum(x*x for x in vec)**0.5
        vecs.append([x/(norm+1e-8) for x in vec])
    return vecs

def _cosine(a: list[float], b: list[float]) -> float:
    va, vb = np.array(a, np.float32), np.array(b, np.float32)
    return float(np.dot(va, vb) / (np.linalg.norm(va)*np.linalg.norm(vb)+1e-8))

class RecommendationAgent:
    def __init__(self, model: str = "gpt-4o"):
        self.model = model

    def recommend(self, query: str, items: list[str], ids: list[str] | None = None,
                  metadata: list[dict] | None = None, top_k: int = 5) -> dict:
        if not items:
            return {"query":query,"recommendations":[],"agent":"recommendation-agent"}
        all_texts = [query] + items
        embeddings = _embed(all_texts)
        q_vec = embeddings[0]; item_vecs = embeddings[1:]
        scored = sorted(enumerate(item_vecs), key=lambda x: _cosine(q_vec, x[1]), reverse=True)[:top_k]
        recs = []
        for rank, (idx, _) in enumerate(scored):
            score = _cosine(q_vec, item_vecs[idx])
            recs.append({"rank":rank+1,"id":ids[idx] if ids else str(idx),"text":items[idx],
                         "score":round(score,6),"reason":f"Semantic similarity {score:.1%} to query",
                         "metadata":metadata[idx] if metadata else {}})
        return {"agent":"recommendation-agent","query":query,"total_candidates":len(items),"recommendations":recs}

    def explain(self, query: str, item: str) -> str:
        ans, _ = _simple(f"In 1-2 sentences, why is this relevant?\nQuery: {query}\nItem: {item}")
        return ans

def run(query: str, items: list[str], top_k: int = 5) -> dict:
    return RecommendationAgent().recommend(query, items, top_k=top_k)
