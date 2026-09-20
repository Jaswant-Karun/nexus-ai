from __future__ import annotations

import sys
import unittest
from pathlib import Path


API_ROOT = Path(__file__).parents[2] / "backend" / "api"
if str(API_ROOT) not in sys.path:
	sys.path.insert(0, str(API_ROOT))

from schemas.memory import MemoryCreateRequest, MemorySearchRequest  # noqa: E402
from services.memory_service import clear_memories, search_memories, store_memory  # noqa: E402


class MemoryServiceTests(unittest.TestCase):
	def test_memory_can_be_stored_searched_and_cleared(self) -> None:
		clear_memories("memory-test")
		stored = store_memory(MemoryCreateRequest(content="User prefers concise technical reports", namespace="memory-test", scope="long_term"))
		matches = search_memories(MemorySearchRequest(query="concise technical", namespace="memory-test"))
		self.assertEqual(matches[0].id, stored.id)
		self.assertEqual(clear_memories("memory-test"), 1)


if __name__ == "__main__":
	unittest.main()