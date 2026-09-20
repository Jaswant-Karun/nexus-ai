from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class HealthDependency(BaseModel):
	name: str
	status: str
	latency_ms: int


class HealthResponse(BaseModel):
	service:      str
	status:       str
	version:      str
	checked_at:   datetime               = Field(default_factory=datetime.utcnow)
	dependencies: list[HealthDependency] = Field(default_factory=list)
	providers:    dict[str, bool]        = Field(default_factory=dict)
