"""
NEXUS AI — Universal LLM Client
Auto-selects the best available provider: Gemini → Anthropic → OpenAI
Uses your real API keys and falls back gracefully.

Current status from your .env:
  - Google Gemini 2.5 Flash  ✅  WORKING
  - Anthropic Claude          ❌  No credits
  - OpenAI GPT-4o             ❌  No credits

All agents use this client so they all work via Gemini right now.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Any


# ── Load .env automatically ───────────────────────────────────────────────────
def _load_env() -> None:
    from pathlib import Path
    for candidate in [
        Path(__file__).parent.parent.parent / ".env",
        Path(__file__).parent.parent.parent.parent / ".env",
    ]:
        if candidate.exists():
            with open(candidate) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, _, v = line.partition("=")
                        if k.strip() not in os.environ:
                            os.environ[k.strip()] = v.strip()
            break


_load_env()


# ── Provider availability check ────────────────────────────────────────────────
@lru_cache(maxsize=1)
def _best_provider() -> str:
    """Return the first provider with a configured API key."""
    if os.getenv("GOOGLE_AI_API_KEY", "").strip():
        return "gemini"
    if os.getenv("ANTHROPIC_API_KEY", "").strip():
        return "anthropic"
    if os.getenv("OPENAI_API_KEY", "").strip():
        return "openai"
    raise RuntimeError(
        "No AI provider API key found. "
        "Add GOOGLE_AI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY to .env"
    )


# ── Gemini backend ─────────────────────────────────────────────────────────────
def _gemini_chat(messages: list[dict], model: str = "models/gemini-2.5-flash",
                 temperature: float = 0.4, max_tokens: int = 4096) -> tuple[str, int]:
    import google.generativeai as genai
    import time
    genai.configure(api_key=os.environ["GOOGLE_AI_API_KEY"])

    # Map OpenAI message format → Gemini format
    system_parts: list[str] = []
    history:      list[dict] = []
    last_user     = ""

    for msg in messages:
        role    = msg["role"]
        content = msg["content"]
        if role == "system":
            system_parts.append(content)
        elif role == "user":
            if history and history[-1]["role"] == "user":
                history[-1]["parts"][0] += "\n" + content
            else:
                history.append({"role": "user", "parts": [content]})
            last_user = content
        elif role == "assistant":
            history.append({"role": "model", "parts": [content]})

    system_instruction = "\n\n".join(system_parts) if system_parts else None

    gen_config = genai.types.GenerationConfig(
        temperature=min(temperature, 1.0),
        max_output_tokens=max_tokens,
    )

    # Try models in order: flash → flash-lite → flash (retry after wait)
    model_fallbacks = [model, "models/gemini-2.5-flash-lite", "models/gemini-flash-latest"]
    last_exc = None

    for try_model in model_fallbacks:
        try:
            gemini = genai.GenerativeModel(
                model_name=try_model,
                system_instruction=system_instruction,
                generation_config=gen_config,
            )
            if len(history) > 1:
                chat = gemini.start_chat(history=history[:-1])
                resp = chat.send_message(history[-1]["parts"][0])
            else:
                prompt = last_user or (history[0]["parts"][0] if history else "Hello")
                resp   = gemini.generate_content(prompt)

            text   = resp.text or ""
            tokens = getattr(getattr(resp, "usage_metadata", None), "total_token_count", 0) or 0
            return text, tokens
        except Exception as exc:
            last_exc = exc
            err_str  = str(exc)
            # Extract retry delay from error message
            import re
            m = re.search(r"retry in (\d+(?:\.\d+)?)s", err_str)
            wait = float(m.group(1)) + 1 if m else 0
            if "RESOURCE_EXHAUSTED" in err_str or "429" in err_str:
                if try_model != model_fallbacks[-1] and wait > 0 and wait < 30:
                    time.sleep(wait)
                    continue
            # Not a rate-limit error — don't retry other models
            raise

    raise last_exc  # type: ignore[misc]


# ── Anthropic backend ─────────────────────────────────────────────────────────
def _anthropic_chat(messages: list[dict], model: str = "claude-3-5-sonnet-20241022",
                    temperature: float = 0.4, max_tokens: int = 4096) -> tuple[str, int]:
    import anthropic
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    system_parts = [m["content"] for m in messages if m["role"] == "system"]
    chat_msgs    = [m for m in messages if m["role"] in ("user", "assistant")]
    system_str   = "\n\n".join(system_parts) if system_parts else anthropic.NOT_GIVEN

    resp   = client.messages.create(
        model=model, max_tokens=max_tokens,
        system=system_str,
        messages=chat_msgs,
        temperature=temperature,
    )
    text   = resp.content[0].text if resp.content else ""
    tokens = (resp.usage.input_tokens + resp.usage.output_tokens) if resp.usage else 0
    return text, tokens


# ── OpenAI backend ─────────────────────────────────────────────────────────────
def _openai_chat(messages: list[dict], model: str = "gpt-4o",
                 temperature: float = 0.4, max_tokens: int = 4096) -> tuple[str, int]:
    from openai import OpenAI
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    resp   = client.chat.completions.create(
        model=model, messages=messages,
        temperature=temperature, max_tokens=max_tokens,
    )
    text   = resp.choices[0].message.content or ""
    tokens = resp.usage.total_tokens if resp.usage else 0
    return text, tokens


# ── MODEL NAME MAPPING ─────────────────────────────────────────────────────────
_GEMINI_MODELS = {
    "gpt-4o":                    "models/gemini-2.5-flash",
    "gpt-4o-mini":               "models/gemini-2.5-flash-lite",
    "claude-3-5-sonnet-20241022":"models/gemini-2.5-flash",
    "claude-3-5-haiku-20241022": "models/gemini-2.5-flash-lite",
    "gemini-1.5-pro":            "models/gemini-2.5-pro-preview-06-05",
    "gemini-1.5-flash":          "models/gemini-2.5-flash",
}


def _resolve_model(model: str, provider: str) -> str:
    if provider == "gemini":
        return _GEMINI_MODELS.get(model, "models/gemini-2.5-flash")
    return model


# ── Main public API ────────────────────────────────────────────────────────────
def chat(messages: list[dict],
         model: str = "gpt-4o",
         temperature: float = 0.4,
         max_tokens: int = 4096,
         provider: str | None = None) -> tuple[str, int]:
    """
    Send chat messages to the best available LLM provider.
    Returns (text_response, tokens_used).

    Priority: Gemini → Anthropic → OpenAI
    Specify provider="gemini"|"anthropic"|"openai" to force a specific one.
    """
    chosen   = provider or _best_provider()
    resolved = _resolve_model(model, chosen)

    if chosen == "gemini":
        return _gemini_chat(messages, resolved, temperature, max_tokens)
    elif chosen == "anthropic":
        return _anthropic_chat(messages, resolved, temperature, max_tokens)
    else:
        return _openai_chat(messages, resolved, temperature, max_tokens)


def simple(prompt: str, system: str = "", model: str = "gpt-4o",
           temperature: float = 0.4) -> tuple[str, int]:
    """Convenience wrapper for single-turn prompts."""
    msgs: list[dict] = []
    if system:
        msgs.append({"role": "system", "content": system})
    msgs.append({"role": "user", "content": prompt})
    return chat(msgs, model=model, temperature=temperature)


def provider_info() -> dict:
    """Return which provider is active and why."""
    p = _best_provider()
    status = {
        "gemini":    bool(os.getenv("GOOGLE_AI_API_KEY", "").strip()),
        "anthropic": bool(os.getenv("ANTHROPIC_API_KEY", "").strip()),
        "openai":    bool(os.getenv("OPENAI_API_KEY", "").strip()),
    }
    return {
        "active_provider":  p,
        "active_model":     _resolve_model("gpt-4o", p),
        "provider_status":  status,
        "message": (
            f"Using {p.upper()} — "
            + ("all providers available." if all(status.values()) else
               "some providers unavailable (out of credits or no key).")
        ),
    }
