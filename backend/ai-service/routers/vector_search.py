"""Router — Vector Search (Qdrant) endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.vector_search import (
    DeleteRequest, HybridSearchRequest, IndexRequest, IndexResponse,
    SearchRequest, SearchResponse,
)
from vector_search.qdrant_store import (
    delete_documents, hybrid_search, index_documents, search_documents,
)

router = APIRouter(prefix="/vector-search", tags=["Vector Search"])


@router.post("/index", response_model=IndexResponse,
             summary="Index documents into a Qdrant collection")
def index(request: IndexRequest) -> IndexResponse:
    """
    Embeds documents with OpenAI text-embedding-3-small (default) and upserts
    them into a Qdrant collection. Creates the collection automatically.
    """
    try:
        return index_documents(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/search", response_model=SearchResponse,
             summary="Dense vector similarity search")
def search(request: SearchRequest) -> SearchResponse:
    """
    Embeds the query and retrieves the top-k most similar documents
    from the Qdrant collection using cosine similarity.
    """
    try:
        return search_documents(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/hybrid-search", response_model=SearchResponse,
             summary="Hybrid BM25 + dense vector search")
def hybrid(request: HybridSearchRequest) -> SearchResponse:
    """
    Combines dense vector similarity (default weight 0.7) with BM25-style
    keyword overlap scoring (default weight 0.3) for higher precision RAG.
    """
    try:
        return hybrid_search(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.delete("/delete", summary="Delete documents from a collection by ID")
def delete(request: DeleteRequest) -> dict:
    try:
        return delete_documents(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
