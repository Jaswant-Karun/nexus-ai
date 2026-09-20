from __future__ import annotations

import sys
import unittest
from pathlib import Path


API_ROOT = Path(__file__).parents[2] / "backend" / "api"
if str(API_ROOT) not in sys.path:
	sys.path.insert(0, str(API_ROOT))

from schemas.knowledge_graph import EntityCreateRequest, RelationshipCreateRequest  # noqa: E402
from services.knowledge_graph_service import create_entity, create_relationship, neighbours, search_entities  # noqa: E402


class KnowledgeGraphTests(unittest.TestCase):
	def test_entities_relationships_search_and_traversal(self) -> None:
		aws = create_entity(EntityCreateRequest(label="AWS", category="Cloud", confidence=0.9))
		ec2 = create_entity(EntityCreateRequest(label="EC2", category="Compute", confidence=0.8))
		create_relationship(RelationshipCreateRequest(subject_id=aws.id, predicate="provides", object_id=ec2.id, confidence=0.95))
		self.assertEqual(search_entities("AWS")[0].entity.id, aws.id)
		self.assertEqual(neighbours(aws.id)[0].entity.id, ec2.id)


if __name__ == "__main__":
	unittest.main()