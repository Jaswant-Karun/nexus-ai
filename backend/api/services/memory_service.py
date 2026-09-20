from __future__ import annotations

import re
from datetime import UTC, datetime
from uuid import uuid4

from schemas.memory import MemoryCreateRequest, MemoryItem, MemorySearchRequest


_memories: dict[str, MemoryItem] = {}


def store_memory(request: MemoryCreateRequest) -> MemoryItem:
	item = MemoryItem(
		id=f"mem_{uuid4().hex[:12]}",
		content=request.content.strip(),
		scope=request.scope,
		namespace=request.namespace,
		importance=request.importance,
		created_at=datetime.now(UTC).isoformat(),
	)
	_memories[item.id] = item
	return item


def list_memories(namespace: str, scope: str | None = None) -> list[MemoryItem]:
	return [
		item for item in reversed(list(_memories.values()))
		if item.namespace == namespace and (scope is None or item.scope == scope)
	]


def search_memories(request: MemorySearchRequest) -> list[MemoryItem]:
	terms = _terms(request.query)
	candidates = list_memories(request.namespace)
	ranked = sorted(candidates, key=lambda item: (len(terms & _terms(item.content)), item.importance), reverse=True)
	return [item for item in ranked if terms & _terms(item.content)][: request.limit]


def delete_memory(memory_id: str) -> bool:
	return _memories.pop(memory_id, None) is not None


def clear_memories(namespace: str, scope: str | None = None) -> int:
	ids = [item.id for item in list_memories(namespace, scope)]
	for memory_id in ids:
		del _memories[memory_id]
	return len(ids)


def _terms(value: str) -> set[str]:
	return set(re.findall(r"[a-z0-9]{3,}", value.lower()))