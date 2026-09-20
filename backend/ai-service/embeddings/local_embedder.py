"""Local sentence-transformers embedder (no API key needed)."""

from __future__ import annotations

import numpy as np

# Lazy-import to avoid slow startup when not needed
_model = None


def _get_model(model_name: str = "all-MiniLM-L6-v2"):
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(model_name)
    return _model


def embed_local(texts: list[str], model_name: str = "all-MiniLM-L6-v2",
                normalize: bool = True) -> list[list[float]]:
    """Embed texts locally using sentence-transformers."""
    model = _get_model(model_name)
    embeddings = model.encode(texts, normalize_embeddings=normalize,
                              show_progress_bar=False)
    return embeddings.tolist()


def cosine_sim(a: list[float], b: list[float]) -> float:
    va = np.array(a, dtype=np.float32)
    vb = np.array(b, dtype=np.float32)
    return float(np.dot(va, vb) / (np.linalg.norm(va) * np.linalg.norm(vb) + 1e-8))
