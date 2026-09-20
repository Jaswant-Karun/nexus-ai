"""Qdrant vector store integration — index, search, hybrid search, delete."""

from __future__ import annotations

import os
import uuid
from typing import Any

from openai import OpenAI

from schemas.vector_search import (
    DeleteRequest, HybridSearchRequest, IndexRequest, IndexResponse,
    SearchHit, SearchRequest, SearchResponse,
)

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
_QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
_QDRANT_KEY = os.getenv("QDRANT_API_KEY", "")


def _get_qdrant():
    from qdrant_client import QdrantClient
    if _QDRANT_KEY:
        return QdrantClient(url=_QDRANT_URL, api_key=_QDRANT_KEY)
    return QdrantClient(url=_QDRANT_URL)


def _embed(texts: list[str], model: str) -> list[list[float]]:
    resp = _client.embeddings.create(model=model, input=texts)
    return [d.embedding for d in resp.data]


def index_documents(req: IndexRequest) -> IndexResponse:
    from qdrant_client.models import Distance, PointStruct, VectorParams

    q   = _get_qdrant()
    ids = req.ids or [str(uuid.uuid4()) for _ in req.documents]

    # Ensure collection exists
    existing = [c.name for c in q.get_collections().collections]
    if req.collection not in existing:
        q.create_collection(
            collection_name=req.collection,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )

    vectors = _embed(req.documents, req.embed_model)
    metadata_list = req.metadata or [{}] * len(req.documents)

    points = [
        PointStruct(
            id=ids[i],
            vector=vectors[i],
            payload={"text": req.documents[i], **metadata_list[i]},
        )
        for i in range(len(req.documents))
    ]
    q.upsert(collection_name=req.collection, points=points)

    return IndexResponse(collection=req.collection,
                         indexed=len(points), failed=0, ids=ids)


def search_documents(req: SearchRequest) -> SearchResponse:
    q      = _get_qdrant()
    q_vec  = _embed([req.query], req.embed_model)[0]
    kwargs: dict[str, Any] = {"score_threshold": req.score_threshold} if req.score_threshold > 0 else {}
    if req.filters:
        from qdrant_client.models import Filter, FieldCondition, MatchValue
        must = [FieldCondition(key=k, match=MatchValue(value=v))
                for k, v in req.filters.items()]
        kwargs["query_filter"] = Filter(must=must)

    hits = q.query_points(
        collection_name=req.collection,
        query=q_vec,
        limit=req.top_k,
        with_payload=True,
        **kwargs,
    ).points

    results = [
        SearchHit(
            id=str(h.id),
            score=round(h.score, 6),
            text=h.payload.get("text", "") if h.payload else "",
            metadata={k: v for k, v in (h.payload or {}).items() if k != "text"},
        )
        for h in hits
    ]
    return SearchResponse(query=req.query, collection=req.collection,
                          hits=results, total=len(results))


def hybrid_search(req: HybridSearchRequest) -> SearchResponse:
    """Combine dense vector search with BM25-style keyword filtering."""
    vec_req = SearchRequest(
        collection=req.collection, query=req.query,
        top_k=req.top_k * 3, embed_model=req.embed_model,
    )
    vec_results = search_documents(vec_req)

    query_terms = set(req.query.lower().split())
    rescored: list[SearchHit] = []
    for hit in vec_results.hits:
        doc_terms = set(hit.text.lower().split())
        overlap   = len(query_terms & doc_terms) / max(len(query_terms), 1)
        hybrid    = req.vector_weight * hit.score + req.bm25_weight * overlap
        rescored.append(SearchHit(id=hit.id, score=round(hybrid, 6),
                                  text=hit.text, metadata=hit.metadata))

    rescored.sort(key=lambda h: h.score, reverse=True)
    return SearchResponse(query=req.query, collection=req.collection,
                          hits=rescored[:req.top_k], total=len(rescored[:req.top_k]))


def delete_documents(req: DeleteRequest) -> dict:
    q = _get_qdrant()
    q.delete(collection_name=req.collection, points_selector=req.ids)
    return {"deleted": len(req.ids), "collection": req.collection}
