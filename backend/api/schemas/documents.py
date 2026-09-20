from __future__ import annotations

from pydantic import BaseModel, Field


class DocumentIngestRequest(BaseModel):
	name: str = Field(min_length=1, max_length=255)
	content: str = Field(min_length=1, max_length=2_000_000)
	mime_type: str = "text/plain"
	source: str | None = None


class DocumentChunk(BaseModel):
	document_id: str
	chunk_id: str
	text: str
	chunk_index: int
	source: str


class DocumentIngestResponse(BaseModel):
	document_id: str
	name: str
	chunk_count: int
	characters: int
	status: str


class RetrievalRequest(BaseModel):
	query: str = Field(min_length=2, max_length=1000)
	limit: int = Field(default=5, ge=1, le=20)


class RetrievalResult(BaseModel):
	chunk_id: str
	document_id: str
	text: str
	source: str
	relevance: float