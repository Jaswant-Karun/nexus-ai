"""Base agent class that all specialised agents inherit from."""

from __future__ import annotations

import os
import time
import uuid
from abc import ABC, abstractmethod
from typing import Any

from openai import OpenAI

from schemas.agent import (
    AgentConfig, AgentMessage, AgentRunRequest, AgentRunResponse, AgentStep,
)


class BaseAgent(ABC):
    """Abstract base for every NEXUS AI agent."""

    def __init__(self, config: AgentConfig) -> None:
        self.config    = config
        self.agent_id  = config.agent_id or f"agent_{uuid.uuid4().hex[:8]}"
        self._client   = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
        self._history: list[AgentMessage] = []
        self._steps:   list[AgentStep]    = []
        self._tokens   = 0

    # ── Subclasses implement this ──────────────────────────────
    @abstractmethod
    def _build_system_prompt(self) -> str: ...

    # ── Shared utilities ───────────────────────────────────────
    def _call_llm(self, messages: list[dict], temperature: float | None = None) -> tuple[str, int]:
        """Call OpenAI and return (content, tokens_used)."""
        resp = self._client.chat.completions.create(
            model=self.config.model,
            messages=messages,
            temperature=temperature if temperature is not None else self.config.temperature,
            max_tokens=2048,
        )
        content = resp.choices[0].message.content or ""
        tokens  = resp.usage.total_tokens if resp.usage else 0
        self._tokens += tokens
        return content, tokens

    def _record_step(self, step: int, thought: str, action: str,
                     observation: str, tool: str | None = None) -> None:
        self._steps.append(AgentStep(
            step=step, thought=thought, action=action,
            observation=observation, tool_used=tool,
        ))

    def _build_messages(self, task: str, context_docs: list[str]) -> list[dict]:
        msgs: list[dict] = [{"role": "system", "content": self._build_system_prompt()}]
        if context_docs:
            ctx = "\n\n".join(f"[Doc {i+1}]\n{d}" for i, d in enumerate(context_docs[:5]))
            msgs.append({"role": "system", "content": f"Context documents:\n{ctx}"})
        for h in self._history[-8:]:   # keep last 8 turns
            msgs.append({"role": h.role, "content": h.content})
        msgs.append({"role": "user", "content": task})
        return msgs

    def run(self, request: AgentRunRequest) -> AgentRunResponse:
        self._history  = list(request.history)
        self._steps    = []
        self._tokens   = 0
        messages       = self._build_messages(request.task, request.context_docs)

        # Step 1 – initial reasoning
        thought, _ = self._call_llm(
            messages + [{"role": "user", "content": f"Think step-by-step about: {request.task}"}]
        )
        self._record_step(1, thought, "Initial reasoning", "Reasoning complete")

        # Step 2 – final answer
        answer_messages = messages + [
            {"role": "assistant", "content": f"My reasoning: {thought}"},
            {"role": "user",      "content": "Now provide your final, concise answer."},
        ]
        answer, _ = self._call_llm(answer_messages)
        self._record_step(2, "Formulating answer", "Generate response", answer[:120] + "…")

        return AgentRunResponse(
            agent_id=self.agent_id,
            task=request.task,
            answer=answer,
            steps=self._steps,
            tokens_used=self._tokens,
            model=self.config.model,
            success=bool(answer),
        )
