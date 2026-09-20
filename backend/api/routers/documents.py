from __future__ import annotations

from fastapi import APIRouter

from schemas.documents import DocumentIngestRequest, DocumentIngestResponse, RetrievalRequest, RetrievalResult
from services.rag_service import ingest_document, search_documents


router = APIRouter(tags=["documents"])


@router.post("/documents/ingest", response_model=DocumentIngestResponse)
def create_document(request: DocumentIngestRequest) -> DocumentIngestResponse:
	return ingest_document(request)


@router.post("/rag/search", response_model=list[RetrievalResult])
def search_knowledge(request: RetrievalRequest) -> list[RetrievalResult]:
	return search_documents(request.query, request.limit)