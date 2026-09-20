"""OpenAI embedding pipeline with batching and caching."""

from __future__ import annotations

import hashlib
import os
from functools import lru_cache

import numpy as np
from openai import OpenAI

from schemas.embedding import EmbedRequest, EmbedResponse, SimilarityRequest, SimilarityResponse

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

# ── In-memory cache (key = sha256(text+model)) ────────────────────────────────
_cache: dict[str, list[float]] = {}


def _cache_key(text: str, model: str) -> str:
    return hashlib.sha256(f"{model}::{text}".encode()).hexdigest()


def embed_texts(texts: list[str], model: str = "text-embedding-3-small",
                normalize: bool = True) -> tuple[list[list[float]], int]:
    """Return (embeddings, total_tokens).  Hits cache where possible."""
    vectors: list[list[float] | None] = [None] * len(texts)
    uncached_idx:  list[int]  = []
    uncached_text: list[str]  = []

    for i, t in enumerate(texts):
        key = _cache_key(t, model)
        if key in _cache:
            vectors[i] = _cache[key]
        else:
            uncached_idx.append(i)
            uncached_text.append(t)

    tokens = 0
    if uncached_text:
        response = _client.embeddings.create(model=model, input=uncached_text)
        tokens   = response.usage.total_tokens if response.usage else 0
        for list_pos, data in enumerate(response.data):
            vec = data.embedding
            if normalize:
                arr  = np.array(vec, dtype=np.float32)
                norm = np.linalg.norm(arr)
                if norm > 0:
                    vec = (arr / norm).tolist()
            orig_i = uncached_idx[list_pos]
            vectors[orig_i] = vec
            _cache[_cache_key(texts[orig_i], model)] = vec  # type: ignore[arg-type]

    return vectors, tokens  # type: ignore[return-value]


def embed_request(req: EmbedRequest) -> EmbedResponse:
    vecs, tokens = embed_texts(req.texts, req.model.value, req.normalize)
    dims = len(vecs[0]) if vecs else 0
    return EmbedResponse(model=req.model.value, embeddings=vecs,
                         dimensions=dims, token_count=tokens)


def cosine_similarity(a: list[float], b: list[float]) -> float:
    va = np.array(a, dtype=np.float32)
    vb = np.array(b, dtype=np.float32)
    dot  = float(np.dot(va, vb))
    norm = float(np.linalg.norm(va) * np.linalg.norm(vb))
    return round(dot / norm if norm > 0 else 0.0, 6)


def similarity_request(req: SimilarityRequest) -> SimilarityResponse:
    [va, vb], tokens = embed_texts([req.text_a, req.text_b], req.model.value)
    score = cosine_similarity(va, vb)
    return SimilarityResponse(text_a=req.text_a, text_b=req.text_b,
                               score=score, model=req.model.value)
