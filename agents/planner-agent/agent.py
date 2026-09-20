"""NEXUS AI — Planner Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import json, os, sys, uuid
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm

SYSTEM = """You are the NEXUS AI Planner Agent.
Decompose the goal into ordered subtasks. Return ONLY valid JSON:
{"plan_id":"<uuid>","goal":"<goal>","strategy":"<strategy>","reasoning":"<why>",
 "subtasks":[{"id":"t1","title":"<title>","description":"<desc>","priority":"high|medium|low|critical",
  "agent_role":"analyst|researcher|coder|critic|summarizer|knowledge|memory","depends_on":[],"estimated_tokens":500,"tools":[]}],
"execution_order":["t1","t2"]}"""

class PlannerAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.2):
        self.model = model; self.temperature = temperature

    def plan(self, goal: str, context: str = "", constraints: list[str] | None = None, max_steps: int = 10) -> dict:
        parts = [f"Goal: {goal}"]
        if context: parts.append(f"Context: {context}")
        if constraints: parts.append("Constraints:\n" + "\n".join(f"- {c}" for c in constraints))
        parts.append(f"Max subtasks: {max_steps}")

        ans, tok = _llm([{"role":"system","content":SYSTEM},{"role":"user","content":"\n".join(parts)}],
                        model=self.model, temperature=self.temperature)
        try:
            data = json.loads(ans)
        except json.JSONDecodeError:
            data = {"goal": goal, "subtasks": [], "strategy": "Sequential", "reasoning": ans[:200]}
        data.setdefault("plan_id", f"plan_{uuid.uuid4().hex[:8]}")
        data["agent"] = "planner-agent"; data["tokens_used"] = tok
        return data

    def replan(self, original_plan: dict, failed_task_id: str, failure_reason: str) -> dict:
        prompt = (f"Original plan:\n{json.dumps(original_plan, indent=2)[:2000]}\n\n"
                  f"Task '{failed_task_id}' failed: {failure_reason}\nCreate a revised plan.")
        ans, tok = _llm([{"role":"system","content":SYSTEM},{"role":"user","content":prompt}],
                        model=self.model, temperature=self.temperature)
        try:
            data = json.loads(ans)
        except json.JSONDecodeError:
            data = {"goal": original_plan.get("goal",""), "subtasks": [], "reasoning": ans[:200]}
        data["agent"] = "planner-agent"; data["replanned"] = True; data["tokens_used"] = tok
        return data

def run(goal: str, context: str = "") -> dict:
    return PlannerAgent().plan(goal, context)
