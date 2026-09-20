"""
NEXUS AI — Planner Agent
Breaks complex goals into ordered subtasks, assigns agent roles,
identifies dependencies, and produces executable execution plans.
"""

from __future__ import annotations

import json
import os
import uuid

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM = """You are the NEXUS AI Planner Agent.
Decompose the given goal into an ordered set of subtasks.
Return ONLY valid JSON:
{
  "plan_id": "<uuid>",
  "goal": "<original goal>",
  "strategy": "<brief strategy>",
  "reasoning": "<why this decomposition>",
  "subtasks": [
    {
      "id": "t1",
      "title": "<title>",
      "description": "<what to do>",
      "priority": "critical|high|medium|low",
      "agent_role": "analyst|researcher|coder|critic|summarizer|knowledge|memory",
      "depends_on": [],
      "estimated_tokens": 500,
      "tools": []
    }
  ],
  "execution_order": ["t1", "t2"]
}"""


class PlannerAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.2):
        self.model       = model
        self.temperature = temperature

    def plan(self, goal: str, context: str = "",
             constraints: list[str] | None = None,
             max_steps: int = 10) -> dict:
        """Decompose a goal into an execution plan."""
        parts = [f"Goal: {goal}"]
        if context:
            parts.append(f"Context: {context}")
        if constraints:
            parts.append("Constraints:\n" + "\n".join(f"- {c}" for c in constraints))
        parts.append(f"Max subtasks: {max_steps}")

        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": SYSTEM},
                {"role": "user",   "content": "\n".join(parts)},
            ],
            temperature=self.temperature,
            response_format={"type": "json_object"},
        )
        raw    = resp.choices[0].message.content or "{}"
        tokens = resp.usage.total_tokens if resp.usage else 0
        data   = json.loads(raw)
        data.setdefault("plan_id", f"plan_{uuid.uuid4().hex[:8]}")
        data["agent"]       = "planner-agent"
        data["tokens_used"] = tokens
        return data

    def replan(self, original_plan: dict, failed_task_id: str,
               failure_reason: str) -> dict:
        """Replan after a task failure."""
        prompt = (
            f"Original plan: {json.dumps(original_plan, indent=2)[:2000]}\n\n"
            f"Task '{failed_task_id}' failed: {failure_reason}\n\n"
            f"Create a revised plan that handles this failure."
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": SYSTEM},
                      {"role": "user",   "content": prompt}],
            temperature=self.temperature,
            response_format={"type": "json_object"},
        )
        data = json.loads(resp.choices[0].message.content or "{}")
        data["agent"] = "planner-agent"
        data["replanned"] = True
        return data


def run(goal: str, context: str = "") -> dict:
    return PlannerAgent().plan(goal, context)
