from __future__ import annotations

import sys
import unittest
from pathlib import Path


API_ROOT = Path(__file__).parents[2] / "backend" / "api"
if str(API_ROOT) not in sys.path:
	 sys.path.insert(0, str(API_ROOT))

from schemas.orchestration import OrchestrationRequest  # noqa: E402
from services.orchestration_service import (  # noqa: E402
	build_orchestration,
	execute_orchestration,
)


class AwseServiceTests(unittest.TestCase):
	def test_classifies_complex_cloud_problem_and_selects_tools(self) -> None:
		result = build_orchestration(
			OrchestrationRequest(
				problem="Compare AWS and Azure for deploying an AI SaaS platform with a low budget."
			)
		)

		self.assertEqual(result.domain, "software")
		self.assertEqual(result.complexity, "high")
		self.assertIn("external-search-adapter", result.selected_tools)
		self.assertIn("cost-calculator", result.selected_tools)
		self.assertEqual(len(result.workflow), 7)
		self.assertEqual(result.validation_status, "pending")

	def test_execution_completes_workflow_and_validation(self) -> None:
		result = execute_orchestration(
			OrchestrationRequest(problem="Create a plan for a low-cost smart irrigation system for farmers.")
		)

		self.assertTrue(all(agent.status == "completed" for agent in result.agents))
		self.assertTrue(all(node.status == "completed" for node in result.workflow))
		self.assertEqual(result.validation_status, "passed")
		self.assertGreaterEqual(result.confidence, 72)


if __name__ == "__main__":
	unittest.main()