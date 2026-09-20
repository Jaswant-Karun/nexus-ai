from __future__ import annotations

import re
from collections import Counter
from uuid import uuid4

from schemas.documents import DocumentChunk, DocumentIngestRequest, DocumentIngestResponse, RetrievalResult


_CHUNK_SIZE = 900
_CHUNK_OVERLAP = 120
_chunks: list[DocumentChunk] = []


def ingest_document(request: DocumentIngestRequest) -> DocumentIngestResponse:
	document_id = f"doc_{uuid4().hex[:12]}"
	cleaned = _clean_text(request.content)
	parts = _chunk_text(cleaned)
	source = request.source or request.name
	_chunks.extend(
		DocumentChunk(
			document_id=document_id,
			chunk_id=f"{document_id}_{index:04d}",
			text=part,
			chunk_index=index,
			source=source,
		)
		for index, part in enumerate(parts)
	)
	return DocumentIngestResponse(
		document_id=document_id,
		name=request.name,
		chunk_count=len(parts),
		characters=len(cleaned),
		status="indexed_in_memory",
	)


def search_documents(query: str, limit: int) -> list[RetrievalResult]:
	query_terms = _terms(query)
	if not query_terms:
		return []
	results: list[RetrievalResult] = []
	for chunk in _chunks:
		chunk_terms = _terms(chunk.text)
		score = len(chunk_terms & query_terms) / max(len(query_terms), 1)
		if score > 0:
			results.append(RetrievalResult(
				chunk_id=chunk.chunk_id,
				document_id=chunk.document_id,
				text=chunk.text,
				source=chunk.source,
				relevance=round(score, 3),
			))
	return sorted(results, key=lambda result: result.relevance, reverse=True)[:limit]


def _clean_text(content: str) -> str:
	return re.sub(r"\s+", " ", content).strip()


def _chunk_text(content: str) -> list[str]:
	if not content:
		return []
	return [content[start : start + _CHUNK_SIZE] for start in range(0, len(content), _CHUNK_SIZE - _CHUNK_OVERLAP)]


def _terms(value: str) -> set[str]:
	return {term for term in re.findall(r"[a-z0-9]{3,}", value.lower()) if term not in {"the", "and", "for", "with", "from"}}