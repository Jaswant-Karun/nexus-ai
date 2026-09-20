from __future__ import annotations

from pydantic import BaseModel, Field


class EntityCreateRequest(BaseModel):
	label: str = Field(min_length=1, max_length=255)
	category: str = Field(min_length=1, max_length=80)
	source: str = Field(default="user", max_length=255)
	confidence: float = Field(default=0.5, ge=0, le=1)


class Entity(BaseModel):
	id: str
	label: str
	category: str
	source: str
	confidence: float


class RelationshipCreateRequest(BaseModel):
	subject_id: str
	predicate: str = Field(min_length=1, max_length=120)
	object_id: str
	source: str = Field(default="user", max_length=255)
	confidence: float = Field(default=0.5, ge=0, le=1)


class Relationship(BaseModel):
	id: str
	subject_id: str
	predicate: str
	object_id: str
	source: str
	confidence: float


class GraphSearchResult(BaseModel):
	entity: Entity
	degree: int


class GraphNeighbour(BaseModel):
	relationship: Relationship
	entity: Entity