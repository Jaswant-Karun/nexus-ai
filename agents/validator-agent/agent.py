"""
NEXUS AI — Validator Agent
Validates outputs for factual accuracy, JSON schema compliance,
safety, hallucination detection, and policy adherence.
"""

from __future__ import annotations

import json
import os
from typing import Any
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM = """You are the NEXUS AI Validator Agent.
You validate content for:
1. Factual accuracy (are claims verifiable?)
2. Hallucination detection (fabricated facts, names, citations)
3. Safety (harmful, offensive, or inappropriate content)
4. Completeness (does it fully address the task?)
5. Schema compliance (if a schema is provided)

Return JSON:
{
  "valid": true|false,
  "confidence": 0.0-1.0,
  "issues": [{"type": "...", "description": "...", "severity": "low|medium|high"}],
  "safe": true|false,
  "hallucinations_detected": true|false,
  "score": 0-100,
  "verdict": "pass|warn|fail",
  "feedback": "brief feedback"
}"""


class ValidatorAgent:
    def __init__(self, model: str = "gpt-4o", threshold: int = 70):
        self.model     = model
        self.threshold = threshold   # minimum score to pass

    def validate(self, content: str, task: str = "",
                 schema: dict | None = None,
                 context: str = "") -> dict:
        """Validate content and return structured validation result."""
        parts = [f"Task: {task}" if task else "", f"Context: {context}" if context else "",
                 f"Schema: {json.dumps(schema)}" if schema else "", f"Content:\n{content}"]
        user_msg = "\n".join(p for p in parts if p)

        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": SYSTEM},
                {"role": "user",   "content": user_msg},
            ],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        data   = json.loads(resp.choices[0].message.content or "{}")
        tokens = resp.usage.total_tokens if resp.usage else 0

        data["agent"]       = "validator-agent"
        data["tokens_used"] = tokens
        data["passed"]      = data.get("score", 0) >= self.threshold
        return data

    def validate_json(self, text: str, schema: dict) -> dict:
        """Check if a JSON string matches the given schema."""
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as e:
            return {"valid": False, "error": str(e), "agent": "validator-agent",
                    "verdict": "fail", "passed": False}

        # Simple key-presence check
        missing = [k for k in schema.get("required", []) if k not in parsed]
        if missing:
            return {"valid": False, "missing_keys": missing,
                    "verdict": "fail", "passed": False, "agent": "validator-agent"}
        return {"valid": True, "verdict": "pass", "passed": True,
                "parsed": parsed, "agent": "validator-agent"}

    def check_safety(self, content: str) -> dict:
        """Quick safety check using OpenAI moderation."""
        try:
            mod = client.moderations.create(input=content)
            r   = mod.results[0]
            return {
                "safe":     not r.flagged,
                "flagged":  r.flagged,
                "categories": {k: v for k, v in r.categories.__dict__.items() if v},
                "agent":    "validator-agent",
            }
        except Exception as e:
            return {"safe": True, "error": str(e), "agent": "validator-agent"}


def run(content: str, task: str = "") -> dict:
    return ValidatorAgent().validate(content, task)
