"""Cross-encoder and Cohere reranking for RAG pipelines."""

from __future__ import annotations

import os

from schemas.reranking import (
    CrossEncoderRerankRequest, RankedDocument, RerankRequest, RerankResponse,
)


def rerank_with_cohere(req: RerankRequest) -> RerankResponse:
    """Use Cohere rerank API (falls back to simple scoring if no key)."""
    api_key = os.getenv("COHERE_API_KEY", "")

    if api_key:
        import cohere
        co   = cohere.Client(api_key)
        resp = co.rerank(
            query=req.query,
            documents=req.documents,
            top_n=req.top_k,
            model=req.model,
        )
        results = [
            RankedDocument(
                index=r.index,
                document=req.documents[r.index] if req.return_documents else "",
                relevance_score=r.relevance_score,
                rank=i + 1,
            )
            for i, r in enumerate(resp.results)
        ]
    else:
        # Fallback: rank by query term overlap (TF-IDF style)
        query_terms = set(req.query.lower().split())
        scored = []
        for i, doc in enumerate(req.documents):
            doc_terms = set(doc.lower().split())
            score = len(query_terms & doc_terms) / (len(query_terms) + 1e-8)
            scored.append((score, i))
        scored.sort(key=lambda x: x[0], reverse=True)
        results = [
            RankedDocument(
                index=idx,
                document=req.documents[idx] if req.return_documents else "",
                relevance_score=round(score, 4),
                rank=rank + 1,
            )
            for rank, (score, idx) in enumerate(scored[:req.top_k])
        ]

    return RerankResponse(query=req.query, results=results,
                          model=req.model, top_k=req.top_k)


def rerank_with_cross_encoder(req: CrossEncoderRerankRequest) -> RerankResponse:
    """Use a local cross-encoder model for reranking."""
    try:
        from sentence_transformers import CrossEncoder
        ce     = CrossEncoder(req.model)
        pairs  = [[req.query, doc] for doc in req.documents]
        scores = ce.predict(pairs).tolist()
    except Exception:
        # Fallback to term overlap
        query_terms = set(req.query.lower().split())
        scores = [
            len(query_terms & set(doc.lower().split())) / (len(query_terms) + 1e-8)
            for doc in req.documents
        ]

    indexed = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)[:req.top_k]
    results = [
        RankedDocument(index=i, document=req.documents[i],
                       relevance_score=round(s, 6), rank=rank + 1)
        for rank, (i, s) in enumerate(indexed)
    ]
    return RerankResponse(query=req.query, results=results,
                          model=req.model, top_k=req.top_k)
