"""
NEXUS AI — Tool Utilities
Shared tool helpers: schema builders, validation, retry wrappers.
"""

from __future__ import annotations

import time
from functools import wraps
from typing import Any, Callable, TypeVar

F = TypeVar("F", bound=Callable[..., Any])


def with_retry(max_attempts: int = 3, delay_s: float = 1.0,
               backoff: float = 2.0) -> Callable[[F], F]:
    """Decorator — retry a function on exception with exponential backoff."""
    def decorator(fn: F) -> F:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            last_error = None
            wait       = delay_s
            for attempt in range(max_attempts):
                try:
                    return fn(*args, **kwargs)
                except Exception as exc:
                    last_error = exc
                    if attempt < max_attempts - 1:
                        time.sleep(wait)
                        wait *= backoff
            raise last_error  # type: ignore[misc]
        return wrapper   # type: ignore[return-value]
    return decorator


def build_openai_function(name: str, description: str,
                           properties: dict[str, Any],
                           required: list[str] | None = None) -> dict:
    """Build an OpenAI function-calling spec dict."""
    return {
        "type": "function",
        "function": {
            "name":        name,
            "description": description,
            "parameters": {
                "type":       "object",
                "properties": properties,
                "required":   required or list(properties.keys()),
            },
        },
    }


def truncate_text(text: str, max_chars: int = 4000) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars - 3] + "…"


def chunk_text(text: str, chunk_size: int = 1500,
               overlap: int = 100) -> list[str]:
    """Split text into overlapping chunks for long-document processing."""
    words  = text.split()
    chunks = []
    start  = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        if end == len(words):
            break
        start = end - overlap
    return chunks
