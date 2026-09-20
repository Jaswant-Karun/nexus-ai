from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest.mock import patch


API_ROOT = Path(__file__).parents[2] / "backend" / "api"
if str(API_ROOT) not in sys.path:
	sys.path.insert(0, str(API_ROOT))

from schemas.model import ModelRequest, ModelMessage  # noqa: E402
from services.model_router import configured_provider  # noqa: E402


class ModelRouterTests(unittest.TestCase):
	def test_provider_requires_credentials(self) -> None:
		with patch.dict("os.environ", {"MODEL_PROVIDER": "openai-compatible", "LLM_API_KEY": ""}, clear=False):
			with self.assertRaises(Exception):
				configured_provider()

	def test_model_request_is_structured(self) -> None:
		request = ModelRequest(messages=[ModelMessage(role="user", content="hello")])
		self.assertEqual(request.messages[0].role, "user")
		self.assertEqual(request.temperature, 0.2)


if __name__ == "__main__":
	unittest.main()