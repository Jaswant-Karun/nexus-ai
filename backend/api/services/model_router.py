from __future__ import annotations

import json
import os
from dataclasses import dataclass
from urllib import error, request

from fastapi import HTTPException

from schemas.model import ModelRequest, ModelResponse


@dataclass(frozen=True)
class ProviderConfig:
	name: str
	base_url: str
	api_key: str
	default_model: str


class OpenAICompatibleProvider:
	def __init__(self, config: ProviderConfig) -> None:
		self.config = config

	def complete(self, payload: ModelRequest) -> ModelResponse:
		model = payload.model or self.config.default_model
		body = json.dumps({
			"model": model,
			"messages": [message.model_dump() for message in payload.messages],
			"temperature": payload.temperature,
			"max_tokens": payload.max_tokens,
		}).encode("utf-8")
		req = request.Request(
			f"{self.config.base_url.rstrip('/')}/chat/completions",
			data=body,
			headers={
				"Authorization": f"Bearer {self.config.api_key}",
				"Content-Type": "application/json",
			},
			method="POST",
		)
		try:
			with request.urlopen(req, timeout=60) as response:
				result = json.loads(response.read().decode("utf-8"))
		except error.HTTPError as exc:
			detail = exc.read().decode("utf-8", errors="replace")
			raise HTTPException(status_code=502, detail=f"{self.config.name} provider error: {detail[:500]}") from exc
		except (error.URLError, TimeoutError) as exc:
			raise HTTPException(status_code=504, detail=f"{self.config.name} provider timed out or is unavailable") from exc

		choices = result.get("choices") or []
		content = choices[0].get("message", {}).get("content") if choices else None
		if not isinstance(content, str) or not content:
			raise HTTPException(status_code=502, detail="Model provider returned no assistant content")
		usage = result.get("usage") or {}
		return ModelResponse(
			model=result.get("model", model),
			provider=self.config.name,
			content=content,
			input_tokens=usage.get("prompt_tokens"),
			output_tokens=usage.get("completion_tokens"),
			total_tokens=usage.get("total_tokens"),
		)


def configured_provider() -> OpenAICompatibleProvider:
	provider = os.getenv("MODEL_PROVIDER", "openai-compatible")
	if provider not in {"openai-compatible", "groq", "ollama"}:
		raise HTTPException(status_code=500, detail=f"Unsupported model provider: {provider}")
	api_key = os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY", "")
	if provider == "groq":
		base_url = os.getenv("MODEL_BASE_URL", "https://api.groq.com/openai/v1")
	elif provider == "ollama":
		base_url = os.getenv("MODEL_BASE_URL", "http://127.0.0.1:11434/v1")
	else:
		base_url = os.getenv("MODEL_BASE_URL", "https://api.openai.com/v1")
	if provider != "ollama" and not api_key:
		raise HTTPException(status_code=503, detail="No model provider API key is configured")
	return OpenAICompatibleProvider(ProviderConfig(
		name=provider,
		base_url=base_url,
		api_key=api_key,
		default_model=os.getenv("MODEL_NAME", "gpt-4o-mini"),
	))


def complete_model_request(payload: ModelRequest) -> ModelResponse:
	return configured_provider().complete(payload)