from __future__ import annotations

from fastapi import APIRouter, Query

from schemas.memory import MemoryCreateRequest, MemoryItem, MemorySearchRequest
from services.memory_service import clear_memories, delete_memory, list_memories, search_memories, store_memory


router = APIRouter(prefix="/memory", tags=["memory"])


@router.post("", response_model=MemoryItem)
def create_memory(request: MemoryCreateRequest) -> MemoryItem:
	return store_memory(request)


@router.get("", response_model=list[MemoryItem])
def get_memories(namespace: str = "local", scope: str | None = Query(default=None)) -> list[MemoryItem]:
	return list_memories(namespace, scope)


@router.post("/search", response_model=list[MemoryItem])
def search_memory(request: MemorySearchRequest) -> list[MemoryItem]:
	return search_memories(request)


@router.delete("/{memory_id}")
def remove_memory(memory_id: str) -> dict[str, bool]:
	return {"deleted": delete_memory(memory_id)}


@router.delete("")
def clear_memory(namespace: str = "local", scope: str | None = Query(default=None)) -> dict[str, int]:
	return {"deleted": clear_memories(namespace, scope)}