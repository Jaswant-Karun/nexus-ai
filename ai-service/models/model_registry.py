"""
NEXUS AI Service — Model Registry
Central registry of all supported LLM and embedding models.
Handles model selection, fallback chains, and capability checking.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ModelSpec:
    id:            str
    name:          str
    provider:      str          # openai | anthropic | google | local
    model_type:    str          # chat | embedding | vision | code
    context_window: int
    max_output:    int
    input_cost_per_1k:  float  # USD
    output_cost_per_1k: float  # USD
    latency_tier:  str          # fast | standard | slow
    capabilities:  list[str] = field(default_factory=list)
    hosted:        str = "cloud"   # cloud | local


MODEL_REGISTRY: dict[str, ModelSpec] = {
    # ── OpenAI ──────────────────────────────────────────────────────────────
    "gpt-4o": ModelSpec(
        id="gpt-4o", name="GPT-4o", provider="openai", model_type="chat",
        context_window=128_000, max_output=16_384,
        input_cost_per_1k=0.005, output_cost_per_1k=0.015,
        latency_tier="standard",
        capabilities=["chat", "vision", "function-calling", "json-mode", "code"],
    ),
    "gpt-4o-mini": ModelSpec(
        id="gpt-4o-mini", name="GPT-4o Mini", provider="openai", model_type="chat",
        context_window=128_000, max_output=16_384,
        input_cost_per_1k=0.00015, output_cost_per_1k=0.0006,
        latency_tier="fast",
        capabilities=["chat", "function-calling", "json-mode"],
    ),
    "text-embedding-3-small": ModelSpec(
        id="text-embedding-3-small", name="Embedding 3 Small",
        provider="openai", model_type="embedding",
        context_window=8_191, max_output=1536,
        input_cost_per_1k=0.00002, output_cost_per_1k=0,
        latency_tier="fast", capabilities=["embedding"],
    ),
    "text-embedding-3-large": ModelSpec(
        id="text-embedding-3-large", name="Embedding 3 Large",
        provider="openai", model_type="embedding",
        context_window=8_191, max_output=3072,
        input_cost_per_1k=0.00013, output_cost_per_1k=0,
        latency_tier="standard", capabilities=["embedding"],
    ),
    # ── Anthropic ──────────────────────────────────────────────────────────
    "claude-3-5-sonnet": ModelSpec(
        id="claude-3-5-sonnet-20241022", name="Claude 3.5 Sonnet",
        provider="anthropic", model_type="chat",
        context_window=200_000, max_output=8_192,
        input_cost_per_1k=0.003, output_cost_per_1k=0.015,
        latency_tier="standard",
        capabilities=["chat", "vision", "function-calling", "long-context"],
    ),
    # ── Google ─────────────────────────────────────────────────────────────
    "gemini-1-5-pro": ModelSpec(
        id="gemini-1.5-pro", name="Gemini 1.5 Pro",
        provider="google", model_type="chat",
        context_window=1_000_000, max_output=8_192,
        input_cost_per_1k=0.00125, output_cost_per_1k=0.005,
        latency_tier="standard",
        capabilities=["chat", "vision", "long-context", "function-calling"],
    ),
}

DEFAULT_CHAT_MODEL      = "gpt-4o"
DEFAULT_FAST_MODEL      = "gpt-4o-mini"
DEFAULT_EMBED_MODEL     = "text-embedding-3-small"
FALLBACK_CHAIN: list[str] = ["gpt-4o", "claude-3-5-sonnet", "gemini-1-5-pro"]


def get_model(model_id: str) -> ModelSpec | None:
    return MODEL_REGISTRY.get(model_id)


def list_models(model_type: str | None = None,
                provider:   str | None = None) -> list[ModelSpec]:
    models = list(MODEL_REGISTRY.values())
    if model_type:
        models = [m for m in models if m.model_type == model_type]
    if provider:
        models = [m for m in models if m.provider == provider]
    return models


def is_available(model_id: str) -> bool:
    """Check if the model's API key is configured."""
    spec = get_model(model_id)
    if not spec:
        return False
    key_map = {
        "openai":    "OPENAI_API_KEY",
        "anthropic": "ANTHROPIC_API_KEY",
        "google":    "GOOGLE_AI_API_KEY",
    }
    key = key_map.get(spec.provider)
    return bool(key and os.getenv(key, "").strip())


def select_best(capability: str = "chat") -> str:
    """Return the best available model for a given capability."""
    for model_id in FALLBACK_CHAIN:
        spec = get_model(model_id)
        if spec and capability in spec.capabilities and is_available(model_id):
            return model_id
    return DEFAULT_FAST_MODEL
