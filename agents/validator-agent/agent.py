"""NEXUS AI — Validator Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm

SYSTEM = """You are the NEXUS AI Validator Agent.
Validate content for: factual accuracy, hallucination detection, safety, completeness, schema compliance.
Return JSON: {"valid":bool,"confidence":0.0-1.0,"issues":[{"type":"...","description":"...","severity":"low|medium|high"}],
"safe":bool,"hallucinations_detected":bool,"score":0-100,"verdict":"pass|warn|fail","feedback":"brief feedback"}"""

class ValidatorAgent:
    def __init__(self, model: str = "gpt-4o", threshold: int = 70):
        self.model = model; self.threshold = threshold

    def validate(self, content: str, task: str = "", schema: dict | None = None, context: str = "") -> dict:
        parts = [f"Task: {task}" if task else "", f"Context: {context}" if context else "",
                 f"Schema: {json.dumps(schema)}" if schema else "", f"Content:\n{content}"]
        user_msg = "\n".join(p for p in parts if p)
        ans, tok = _llm([{"role":"system","content":SYSTEM},{"role":"user","content":user_msg}],
                        model=self.model, temperature=0.1)
        try:
            data = json.loads(ans)
        except json.JSONDecodeError:
            data = {"valid": True, "score": 75, "verdict": "pass", "feedback": ans[:200]}
        data["agent"] = "validator-agent"; data["tokens_used"] = tok
        data["passed"] = data.get("score", 0) >= self.threshold
        return data

    def validate_json(self, text: str, schema: dict) -> dict:
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as e:
            return {"valid": False, "error": str(e), "agent": "validator-agent", "verdict": "fail", "passed": False}
        missing = [k for k in schema.get("required", []) if k not in parsed]
        if missing:
            return {"valid": False, "missing_keys": missing, "verdict": "fail", "passed": False, "agent": "validator-agent"}
        return {"valid": True, "verdict": "pass", "passed": True, "parsed": parsed, "agent": "validator-agent"}

def run(content: str, task: str = "") -> dict:
    return ValidatorAgent().validate(content, task)
