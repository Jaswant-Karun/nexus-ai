from __future__ import annotations

import re
from uuid import uuid4

from fastapi import HTTPException

from schemas.knowledge_graph import (
	Entity,
	EntityCreateRequest,
	GraphNeighbour,
	GraphSearchResult,
	Relationship,
	RelationshipCreateRequest,
)


_entities: dict[str, Entity] = {}
_relationships: dict[str, Relationship] = {}


def create_entity(request: EntityCreateRequest) -> Entity:
	entity = Entity(id=f"ent_{uuid4().hex[:12]}", **request.model_dump())
	_entities[entity.id] = entity
	return entity


def create_relationship(request: RelationshipCreateRequest) -> Relationship:
	if request.subject_id not in _entities or request.object_id not in _entities:
		raise HTTPException(status_code=404, detail="Both relationship entities must exist")
	relationship = Relationship(id=f"rel_{uuid4().hex[:12]}", **request.model_dump())
	_relationships[relationship.id] = relationship
	return relationship


def search_entities(query: str, limit: int = 20) -> list[GraphSearchResult]:
	terms = set(re.findall(r"[a-z0-9]{2,}", query.lower()))
	results = []
	for entity in _entities.values():
		if terms & set(re.findall(r"[a-z0-9]{2,}", entity.label.lower())):
			results.append(GraphSearchResult(entity=entity, degree=_degree(entity.id)))
	return sorted(results, key=lambda result: result.entity.confidence, reverse=True)[:limit]


def neighbours(entity_id: str) -> list[GraphNeighbour]:
	if entity_id not in _entities:
		raise HTTPException(status_code=404, detail="Entity not found")
	items = []
	for relationship in _relationships.values():
		if relationship.subject_id == entity_id:
			items.append(GraphNeighbour(relationship=relationship, entity=_entities[relationship.object_id]))
		elif relationship.object_id == entity_id:
			items.append(GraphNeighbour(relationship=relationship, entity=_entities[relationship.subject_id]))
	return items


def _degree(entity_id: str) -> int:
	return sum(entity_id in (relationship.subject_id, relationship.object_id) for relationship in _relationships.values())