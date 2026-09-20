"""
NEXUS AI — Analytics Agent
Specialises in data analysis, statistical insights, trend detection,
and generating actionable business intelligence from structured data.
"""

from __future__ import annotations

import json
import os
from typing import Any

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM_PROMPT = """You are the NEXUS AI Analytics Agent — an expert data analyst.
Your capabilities:
- Statistical analysis (descriptive, inferential, predictive)
- Trend detection and anomaly identification
- KPI analysis and business intelligence
- Chart/visualization recommendations
- SQL query generation for data extraction
- Insights synthesis from raw numbers

Always:
1. Think step-by-step
2. Show calculations where relevant
3. Provide actionable recommendations
4. Rate confidence level (low/medium/high)
Return structured JSON when asked for structured output."""


class AnalyticsAgent:
    """Multi-step analytics agent with data reasoning capabilities."""

    def __init__(self, model: str = "gpt-4o", temperature: float = 0.2):
        self.model       = model
        self.temperature = temperature
        self.history: list[dict[str, str]] = []

    def analyze(self, task: str, data: dict[str, Any] | None = None,
                context: str = "") -> dict[str, Any]:
        """Run a full analytics task and return structured insights."""
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if context:
            messages.append({"role": "system", "content": f"Context:\n{context}"})

        user_content = task
        if data:
            user_content += f"\n\nData provided:\n{json.dumps(data, indent=2)[:4000]}"

        messages += self.history[-10:]
        messages.append({"role": "user", "content": user_content})

        response = client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
        )

        answer = response.choices[0].message.content or ""
        tokens = response.usage.total_tokens if response.usage else 0

        self.history.append({"role": "user",      "content": user_content})
        self.history.append({"role": "assistant",  "content": answer})

        return {
            "agent":       "analytics-agent",
            "task":        task,
            "answer":      answer,
            "tokens_used": tokens,
            "model":       self.model,
        }

    def generate_sql(self, description: str, schema: str) -> str:
        """Generate a SQL query from a natural language description."""
        result = self.analyze(
            f"Generate an optimised SQL query for: {description}\n\nSchema:\n{schema}\n\nReturn only the SQL, no explanation."
        )
        return result["answer"]

    def detect_anomalies(self, data: list[float], label: str = "metric") -> dict:
        """Detect anomalies in a numeric series."""
        import statistics
        if len(data) < 3:
            return {"anomalies": [], "note": "Not enough data"}
        mean   = statistics.mean(data)
        stdev  = statistics.stdev(data)
        threshold = 2.0
        anomalies = [{"index": i, "value": v, "zscore": round((v - mean) / stdev, 3)}
                     for i, v in enumerate(data) if abs(v - mean) > threshold * stdev]
        return {
            "label":     label,
            "mean":      round(mean, 4),
            "stdev":     round(stdev, 4),
            "threshold": f"{threshold}σ",
            "anomalies": anomalies,
            "count":     len(anomalies),
        }

    def reset(self) -> None:
        self.history.clear()


# ── Convenience function ──────────────────────────────────────────────────────
def run(task: str, data: dict[str, Any] | None = None) -> dict[str, Any]:
    return AnalyticsAgent().analyze(task, data)
