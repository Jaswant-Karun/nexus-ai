from __future__ import annotations

from fastapi import APIRouter, Query

from schemas.knowledge_graph import Entity, EntityCreateRequest, GraphNeighbour, GraphSearchResult, Relationship, RelationshipCreateRequest
from services.knowledge_graph_service import create_entity, create_relationship, neighbours, search_entities


router = APIRouter(prefix="/knowledge", tags=["knowledge-graph"])


@router.post("/entities", response_model=Entity)
def add_entity(request: EntityCreateRequest) -> Entity:
	return create_entity(request)


@router.post("/relationships", response_model=Relationship)
def add_relationship(request: RelationshipCreateRequest) -> Relationship:
	return create_relationship(request)


@router.get("/search", response_model=list[GraphSearchResult])
def search_graph(query: str = Query(min_length=2), limit: int = Query(default=20, ge=1, le=100)) -> list[GraphSearchResult]:
	return search_entities(query, limit)


@router.get("/entities/{entity_id}/neighbors", response_model=list[GraphNeighbour])
def get_neighbours(entity_id: str) -> list[GraphNeighbour]:
	return neighbours(entity_id)