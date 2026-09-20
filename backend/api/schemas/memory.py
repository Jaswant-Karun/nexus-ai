from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


MemoryScope = Literal["session", "conversation", "project", "long_term", "agent"]


class MemoryCreateRequest(BaseModel):
	content: str = Field(min_length=1, max_length=10_000)
	scope: MemoryScope = "conversation"
	namespace: str = Field(default="local", min_length=1, max_length=120)
	importance: int = Field(default=50, ge=0, le=100)


class MemoryItem(BaseModel):
	id: str
	content: str
	scope: MemoryScope
	namespace: str
	importance: int
	created_at: str


class MemorySearchRequest(BaseModel):
	query: str = Field(min_length=2, max_length=1000)
	namespace: str = Field(default="local", min_length=1, max_length=120)
	limit: int = Field(default=10, ge=1, le=50)