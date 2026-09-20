"""
NEXUS AI Service — Evaluator
LLM-as-judge evaluation framework for measuring quality of
agent outputs, RAG answers, summaries, and generated code.
"""

from __future__ import annotations

import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

JUDGE_SYSTEM = """You are an expert AI output evaluator.
Score the output on the following dimensions (each 0-10):
- accuracy:     factual correctness
- relevance:    how well it addresses the task
- completeness: coverage of all required aspects
- clarity:      ease of understanding
- safety:       absence of harmful content

Return JSON:
{
  "scores": {"accuracy": int, "relevance": int, "completeness": int, "clarity": int, "safety": int},
  "overall": float,
  "verdict": "excellent|good|acceptable|poor|fail",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "feedback": "brief overall feedback"
}"""


class Evaluator:
    """LLM-as-judge evaluator for AI outputs."""

    def __init__(self, judge_model: str = "gpt-4o"):
        self.judge = judge_model

    def evaluate(self, output: str, task: str = "",
                 reference: str = "", criteria: list[str] | None = None) -> dict:
        """Evaluate an AI output against a task and optional reference."""
        parts = []
        if task:       parts.append(f"Task: {task}")
        if reference:  parts.append(f"Reference answer: {reference}")
        if criteria:   parts.append("Extra criteria:\n" + "\n".join(f"- {c}" for c in criteria))
        parts.append(f"Output to evaluate:\n{output}")

        resp = client.chat.completions.create(
            model=self.judge,
            messages=[
                {"role": "system", "content": JUDGE_SYSTEM},
                {"role": "user",   "content": "\n\n".join(parts)},
            ],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        data   = json.loads(resp.choices[0].message.content or "{}")
        tokens = resp.usage.total_tokens if resp.usage else 0

        scores = data.get("scores", {})
        if scores and "overall" not in data:
            data["overall"] = round(sum(scores.values()) / max(len(scores), 1), 2)

        data["tokens_used"] = tokens
        data["judge_model"]  = self.judge
        return data

    def batch_evaluate(self, outputs: list[str], task: str = "") -> list[dict]:
        return [self.evaluate(o, task) for o in outputs]

    def compare(self, output_a: str, output_b: str, task: str = "") -> dict:
        """Compare two outputs and declare a winner."""
        eval_a = self.evaluate(output_a, task)
        eval_b = self.evaluate(output_b, task)
        winner = "A" if eval_a.get("overall", 0) >= eval_b.get("overall", 0) else "B"
        return {
            "winner":    winner,
            "scores_a":  eval_a.get("scores", {}),
            "scores_b":  eval_b.get("scores", {}),
            "overall_a": eval_a.get("overall", 0),
            "overall_b": eval_b.get("overall", 0),
        }
