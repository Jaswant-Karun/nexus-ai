"""
NEXUS AI Service — Tool Registry
Manages callable tools available to AI agents: search, code execution,
file read/write, API calls, database queries, and custom tools.
"""

from __future__ import annotations

import inspect
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class ToolSpec:
    name:        str
    description: str
    fn:          Callable
    parameters:  dict[str, Any] = field(default_factory=dict)
    category:    str = "general"   # search | code | file | api | db | general


class ToolRegistry:
    """Central registry of AI agent tools with OpenAI function-calling schema."""

    def __init__(self):
        self._tools: dict[str, ToolSpec] = {}

    def register(self, name: str, description: str,
                 fn: Callable, parameters: dict | None = None,
                 category: str = "general") -> None:
        self._tools[name] = ToolSpec(
            name=name, description=description, fn=fn,
            parameters=parameters or {}, category=category,
        )

    def get(self, name: str) -> ToolSpec | None:
        return self._tools.get(name)

    def call(self, name: str, **kwargs) -> Any:
        spec = self.get(name)
        if not spec:
            raise ValueError(f"Tool '{name}' not registered")
        return spec.fn(**kwargs)

    def to_openai_schema(self) -> list[dict]:
        """Return OpenAI function-calling schema for all tools."""
        return [
            {
                "type": "function",
                "function": {
                    "name":        t.name,
                    "description": t.description,
                    "parameters":  t.parameters,
                },
            }
            for t in self._tools.values()
        ]

    def list_tools(self, category: str | None = None) -> list[dict]:
        tools = self._tools.values()
        if category:
            tools = [t for t in tools if t.category == category]  # type: ignore[assignment]
        return [{"name": t.name, "description": t.description,
                 "category": t.category} for t in tools]


# ── Default global registry ────────────────────────────────────────────────────
registry = ToolRegistry()


# ── Built-in tools ─────────────────────────────────────────────────────────────
def web_search(query: str, top_k: int = 5) -> list[dict]:
    """Stub — replace with real search API (SerpAPI, Tavily, etc.)."""
    return [{"title": f"Result for '{query}'", "snippet": "Stub result.", "url": "#"}]


def calculate(expression: str) -> str:
    """Safely evaluate a math expression."""
    try:
        result = eval(expression, {"__builtins__": {}}, {})  # noqa: S307
        return str(result)
    except Exception as e:
        return f"Error: {e}"


def get_current_datetime() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()


registry.register("web_search",          "Search the web for information",
                   web_search,           category="search",
                   parameters={"type": "object",
                                "properties": {"query": {"type": "string"},
                                               "top_k": {"type": "integer"}},
                                "required": ["query"]})

registry.register("calculate",           "Evaluate a mathematical expression",
                   calculate,            category="general",
                   parameters={"type": "object",
                                "properties": {"expression": {"type": "string"}},
                                "required": ["expression"]})

registry.register("get_current_datetime", "Get the current UTC datetime",
                   get_current_datetime,  category="general",
                   parameters={"type": "object", "properties": {}})
