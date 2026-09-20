from __future__ import annotations

from pydantic import BaseModel, Field


class ModelMessage(BaseModel):
	role: str = Field(pattern="^(system|user|assistant|tool)$")
	content: str = Field(min_length=1, max_length=100_000)


class ModelRequest(BaseModel):
	messages: list[ModelMessage] = Field(min_length=1, max_length=100)
	model: str | None = None
	temperature: float = Field(default=0.2, ge=0, le=2)
	max_tokens: int = Field(default=1200, ge=1, le=16_000)


class ModelResponse(BaseModel):
	model: str
	provider: str
	content: str
	input_tokens: int | None = None
	output_tokens: int | None = None
	total_tokens: int | None = None