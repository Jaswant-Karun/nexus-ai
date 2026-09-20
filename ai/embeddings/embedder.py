"""
NEXUS AI — Embedding Utilities
Shared embedding helpers used across ai/ modules.
Supports OpenAI and local sentence-transformers models.
"""

from __future__ import annotations

import hashlib
import os
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
_cache: dict[str, list[float]] = {}


def embed_openai(texts: list[str], model: str = "text-embedding-3-small",
                 use_cache: bool = True) -> tuple[list[list[float]], int]:
    """Embed texts using OpenAI. Returns (vectors, tokens_used)."""
    result: list[list[float] | None] = [None] * len(texts)
    uncached_idx, uncached_texts = [], []

    for i, text in enumerate(texts):
        key = hashlib.sha256(f"{model}::{text}".encode()).hexdigest()
        if use_cache and key in _cache:
            result[i] = _cache[key]
        else:
            uncached_idx.append(i)
            uncached_texts.append(text)

    tokens = 0
    if uncached_texts:
        resp   = client.embeddings.create(model=model, input=uncached_texts)
        tokens = resp.usage.total_tokens if resp.usage else 0
        for list_pos, data in enumerate(resp.data):
            vec = data.embedding
            orig_i = uncached_idx[list_pos]
            if use_cache:
                key = hashlib.sha256(f"{model}::{texts[orig_i]}".encode()).hexdigest()
                _cache[key] = vec
            result[orig_i] = vec

    return result, tokens   # type: ignore[return-value]


def cosine_similarity(a: list[float], b: list[float]) -> float:
    va = np.array(a, dtype=np.float32)
    vb = np.array(b, dtype=np.float32)
    return float(np.dot(va, vb) / (np.linalg.norm(va) * np.linalg.norm(vb) + 1e-8))


def batch_cosine(query: list[float], docs: list[list[float]]) -> list[float]:
    """Compute cosine similarity between a query and multiple docs efficiently."""
    q  = np.array(query, dtype=np.float32)
    D  = np.array(docs,  dtype=np.float32)
    nq = np.linalg.norm(q)
    nd = np.linalg.norm(D, axis=1) + 1e-8
    return (D @ q / (nd * nq)).tolist()
