"""NEXUS AI — Critic Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm

SYSTEM = """You are the NEXUS AI Critic Agent — a rigorous quality reviewer.
Evaluate content on 5 dimensions (each 0-10):
accuracy, completeness, clarity, safety, actionability.
Return JSON: {"overall_score": float, "scores": {"accuracy":int,"completeness":int,"clarity":int,"safety":int,"actionability":int},
"strengths":["..."],"weaknesses":["..."],"suggestions":["..."],"verdict":"approved|needs_revision|rejected",
"revised_output":"<improved version if not approved>"}"""

class CriticAgent:
    def __init__(self, model: str = "gpt-4o", threshold: float = 7.0):
        self.model = model; self.threshold = threshold

    def critique(self, content: str, task: str = "", domain: str = "general") -> dict:
        prompt = f"Domain: {domain}\nTask: {task}\n\nContent to review:\n{content}\n\nProvide critique as JSON."
        ans, tok = _llm([{"role":"system","content":SYSTEM},{"role":"user","content":prompt}],
                        model=self.model, temperature=0.1)
        try:
            data = json.loads(ans)
        except json.JSONDecodeError:
            data = {"overall_score": 5.0, "verdict": "needs_revision", "feedback": ans[:200]}
        data["agent"] = "critic-agent"; data["tokens_used"] = tok
        data["passed"] = data.get("overall_score", 0) >= self.threshold
        return data

    def approve_or_revise(self, content: str, task: str = "") -> tuple[bool, str]:
        result = self.critique(content, task)
        if result.get("verdict") == "approved" or result.get("passed"):
            return True, content
        return False, result.get("revised_output", content)

def run(content: str, task: str = "") -> dict:
    return CriticAgent().critique(content, task)
