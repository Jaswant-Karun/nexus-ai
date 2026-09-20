"""
NEXUS AI — Critic Agent
Quality review agent that evaluates outputs from other agents.
Provides structured critique, scores, and improvement suggestions.
"""

from __future__ import annotations

import json
import os

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM_PROMPT = """You are the NEXUS AI Critic Agent — a rigorous quality reviewer.
For any content or output you review, evaluate:
1. Accuracy / Correctness (1-10)
2. Completeness (1-10)
3. Clarity / Readability (1-10)
4. Safety / Ethics (1-10)
5. Actionability (1-10)

Always respond with a JSON object:
{
  "overall_score": <float 0-10>,
  "scores": { "accuracy": int, "completeness": int, "clarity": int, "safety": int, "actionability": int },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "verdict": "approved|needs_revision|rejected",
  "revised_output": "<improved version if verdict != approved>"
}"""


class CriticAgent:
    def __init__(self, model: str = "gpt-4o", threshold: float = 7.0):
        self.model     = model
        self.threshold = threshold

    def critique(self, content: str, task: str = "",
                 domain: str = "general") -> dict:
        """Critique any content and return structured feedback."""
        prompt = (
            f"Domain: {domain}\n"
            f"Original task: {task}\n\n"
            f"Content to review:\n{content}\n\n"
            f"Provide your critique as JSON."
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system",  "content": SYSTEM_PROMPT},
                {"role": "user",    "content": prompt},
            ],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        raw    = resp.choices[0].message.content or "{}"
        tokens = resp.usage.total_tokens if resp.usage else 0
        data   = json.loads(raw)
        data.update({"agent": "critic-agent", "tokens_used": tokens,
                     "passed": data.get("overall_score", 0) >= self.threshold})
        return data

    def approve_or_revise(self, content: str, task: str = "") -> tuple[bool, str]:
        """Return (approved, content_or_revision)."""
        result = self.critique(content, task)
        if result.get("verdict") == "approved" or result.get("passed"):
            return True, content
        revision = result.get("revised_output", content)
        return False, revision


def run(content: str, task: str = "") -> dict:
    return CriticAgent().critique(content, task)
