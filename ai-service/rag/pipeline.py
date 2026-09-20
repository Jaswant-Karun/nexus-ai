"""
NEXUS AI Service — RAG Pipeline
Retrieval-Augmented Generation: embed query → retrieve docs → generate grounded answer.
Supports hybrid BM25 + dense vector retrieval.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any

import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

_embed_cache: dict[str, list[float]] = {}


def _embed(text: str, model: str = "text-embedding-3-small") -> list[float]:
    if text in _embed_cache:
        return _embed_cache[text]
    resp = client.embeddings.create(model=model, input=[text])
    vec  = resp.data[0].embedding
    _embed_cache[text] = vec
    return vec


def _cosine(a: list[float], b: list[float]) -> float:
    va, vb = np.array(a, np.float32), np.array(b, np.float32)
    return float(np.dot(va, vb) / (np.linalg.norm(va) * np.linalg.norm(vb) + 1e-8))


@dataclass
class Document:
    id:       str
    text:     str
    metadata: dict[str, Any] = field(default_factory=dict)
    embedding: list[float] | None = None


@dataclass
class RAGResult:
    answer:    str
    sources:   list[dict[str, Any]]
    query:     str
    tokens_used: int


class RAGPipeline:
    """In-process RAG pipeline using OpenAI embeddings and GPT-4o generation."""

    def __init__(self, model: str = "gpt-4o", embed_model: str = "text-embedding-3-small",
                 top_k: int = 5, hybrid_weight: float = 0.7):
        self.model        = model
        self.embed_model  = embed_model
        self.top_k        = top_k
        self.vector_w     = hybrid_weight         # weight for vector similarity
        self.bm25_w       = 1.0 - hybrid_weight   # weight for keyword overlap
        self.documents:    list[Document] = []

    def add_documents(self, texts: list[str],
                      ids:      list[str] | None = None,
                      metadata: list[dict] | None = None) -> None:
        """Add documents to the in-process knowledge store."""
        for i, text in enumerate(texts):
            doc_id   = ids[i] if ids else f"doc_{len(self.documents)+i}"
            meta     = metadata[i] if metadata else {}
            embedding = _embed(text, self.embed_model)
            self.documents.append(Document(id=doc_id, text=text,
                                           metadata=meta, embedding=embedding))

    def retrieve(self, query: str) -> list[Document]:
        """Hybrid BM25 + dense retrieval."""
        if not self.documents:
            return []
        q_vec   = _embed(query, self.embed_model)
        q_terms = set(query.lower().split())
        scored  = []
        for doc in self.documents:
            vec_s  = _cosine(q_vec, doc.embedding or []) if doc.embedding else 0.0
            bm25_s = len(q_terms & set(doc.text.lower().split())) / max(len(q_terms), 1)
            scored.append((self.vector_w * vec_s + self.bm25_w * bm25_s, doc))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [doc for _, doc in scored[:self.top_k]]

    def generate(self, query: str, docs: list[Document]) -> tuple[str, int]:
        """Generate an answer grounded in retrieved docs."""
        context = "\n\n".join(
            f"[Doc {i+1}] {d.metadata.get('title', d.id)}\n{d.text[:1000]}"
            for i, d in enumerate(docs)
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content":
                    "Answer the question using only the provided documents. "
                    "Cite document numbers inline [Doc N]. "
                    "If the answer isn't in the documents, say so."},
                {"role": "system", "content": f"Documents:\n{context}"},
                {"role": "user",   "content": query},
            ],
            temperature=0.1,
        )
        return (resp.choices[0].message.content or ""), (resp.usage.total_tokens if resp.usage else 0)

    def query(self, question: str) -> RAGResult:
        """Full RAG pipeline: retrieve → generate."""
        docs   = self.retrieve(question)
        answer, tokens = self.generate(question, docs)
        return RAGResult(
            answer=answer, query=question, tokens_used=tokens,
            sources=[{"id": d.id, "text": d.text[:200],
                      "metadata": d.metadata} for d in docs],
        )
