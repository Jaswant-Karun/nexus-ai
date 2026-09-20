from __future__ import annotations

import sys
import unittest
from pathlib import Path


API_ROOT = Path(__file__).parents[2] / "backend" / "api"
if str(API_ROOT) not in sys.path:
	sys.path.insert(0, str(API_ROOT))

from schemas.documents import DocumentIngestRequest  # noqa: E402
from services.rag_service import ingest_document, search_documents  # noqa: E402


class RagServiceTests(unittest.TestCase):
	def test_ingest_chunks_and_retrieves_relevant_source(self) -> None:
		result = ingest_document(DocumentIngestRequest(
			name="cloud-notes.md",
			content="AWS and Azure provide cloud infrastructure for AI SaaS platforms. Budget and latency are key decision factors.",
		))
		self.assertEqual(result.status, "indexed_in_memory")
		matches = search_documents("Azure AI platform budget", limit=3)
		self.assertTrue(matches)
		self.assertEqual(matches[0].source, "cloud-notes.md")


if __name__ == "__main__":
	unittest.main()