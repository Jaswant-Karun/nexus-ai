"""
NEXUS AI — Analytics Agent
Data analysis, statistical insights, trend detection, KPI analysis.
Uses the shared LLM client → works with Gemini, Claude, or GPT-4o.
"""

from __future__ import annotations

import sys
import os

# Add shared/ to path so the universal LLM client is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm, simple as _simple

SYSTEM_PROMPT = """You are the NEXUS AI Analytics Agent — an expert data analyst.
Your capabilities:
- Statistical analysis (descriptive, inferential, predictive)
- Trend detection and anomaly identification
- KPI analysis and business intelligence
- Chart/visualisation recommendations
- SQL query generation for data extraction
- Insights synthesis from raw numbers

Always:
1. Think step-by-step through the data
2. Show calculations where relevant
3. Provide 3-5 specific actionable recommendations
4. Rate your confidence level (low/medium/high)"""


class AnalyticsAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.2):
        self.model       = model
        self.temperature = temperature
        self.history: list[dict] = []

    def analyze(self, task: str, data: dict | None = None,
                context: str = "") -> dict:
        """Run a full analytics task and return structured insights."""
        import json

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        if context:
            messages.append({"role": "system", "content": f"Context:\n{context}"})

        user_content = task
        if data:
            user_content += f"\n\nData:\n{json.dumps(data, indent=2)[:4000]}"

        messages += self.history[-10:]
        messages.append({"role": "user", "content": user_content})

        answer, tokens = _llm(messages, model=self.model, temperature=self.temperature)

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
        text, _ = _simple(
            f"Generate optimised SQL for: {description}\n\nSchema:\n{schema}\n\nReturn SQL only.",
            system="You are a SQL expert. Write clean, optimised queries.",
        )
        return text

    def detect_anomalies(self, data: list[float], label: str = "metric") -> dict:
        import statistics
        if len(data) < 3:
            return {"anomalies": [], "note": "Not enough data points"}
        mean   = statistics.mean(data)
        stdev  = statistics.stdev(data)
        thresh = 2.0
        anomalies = [
            {"index": i, "value": v, "zscore": round((v - mean) / stdev, 3)}
            for i, v in enumerate(data) if abs(v - mean) > thresh * stdev
        ]
        return {
            "label":     label,
            "mean":      round(mean, 4),
            "stdev":     round(stdev, 4),
            "threshold": f"{thresh}σ",
            "anomalies": anomalies,
            "count":     len(anomalies),
        }

    def reset(self) -> None:
        self.history.clear()


def run(task: str, data: dict | None = None) -> dict:
    return AnalyticsAgent().analyze(task, data)


if __name__ == "__main__":
    # Quick self-test
    result = run("Give 3 key insights: revenue +25%, churn 5%, NPS 72")
    print(f"[Analytics Agent] Tokens: {result['tokens_used']}")
    print(result["answer"][:300])
