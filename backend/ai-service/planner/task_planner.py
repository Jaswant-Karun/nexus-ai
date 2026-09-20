"""Task decomposition and multi-step execution planning using GPT-4o."""

from __future__ import annotations

import json
import os
import uuid

from openai import OpenAI

from schemas.planner import (
    ExecutionPlan, PlanRequest, PlanResponse, SubTask, TaskPriority,
)

def _get_client() -> OpenAI:
    from config import settings
    return OpenAI(api_key=settings.openai_api_key or os.getenv("OPENAI_API_KEY", ""))

_SYSTEM = """You are an expert AI task planner for the NEXUS AI platform.
Given a goal, decompose it into clear, actionable subtasks.

IMPORTANT: Respond ONLY with valid JSON in this exact structure:
{
  "strategy": "<brief strategy description>",
  "reasoning": "<why this decomposition>",
  "subtasks": [
    {
      "id": "t1",
      "title": "<short title>",
      "description": "<what to do>",
      "priority": "high|medium|low|critical",
      "depends_on": [],
      "agent_role": "analyst|researcher|coder|critic|summarizer|orchestrator",
      "estimated_tokens": 500,
      "tools_required": ["tool_name"]
    }
  ],
  "execution_order": ["t1", "t2"]
}"""


def create_plan(req: PlanRequest) -> PlanResponse:
    context_block = f"\nContext:\n{req.context}" if req.context else ""
    constraints   = "\n".join(f"- {c}" for c in req.constraints) if req.constraints else "None"
    tools_avail   = ", ".join(req.available_tools) if req.available_tools else "general tools"

    user_msg = (
        f"Goal: {req.goal}{context_block}\n"
        f"Constraints:\n{constraints}\n"
        f"Available tools: {tools_avail}\n"
        f"Max subtasks: {req.max_subtasks}"
    )

    try:
        resp = _get_client().chat.completions.create(
            model=req.model,
            messages=[
                {"role": "system", "content": _SYSTEM},
                {"role": "user",   "content": user_msg},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        raw    = resp.choices[0].message.content or "{}"
        tokens = resp.usage.total_tokens if resp.usage else 0
    except Exception as exc:
        err_str = str(exc)
        if "insufficient_quota" in err_str or "credit_balance_exhausted" in err_str or "invalid_api_key" in err_str:
            raw = json.dumps({
                "strategy": "Sequential task execution (offline/fallback mode)",
                "reasoning": f"Plan generated for goal '{req.goal}' [OpenAI quota/key limited]",
                "subtasks": [
                    {
                        "id": "t1",
                        "title": f"Analyze requirement: {req.goal[:30]}...",
                        "description": "Initial task analysis and setup",
                        "priority": "high",
                        "depends_on": [],
                        "agent_role": "analyst",
                        "estimated_tokens": 300,
                        "tools_required": []
                    },
                    {
                        "id": "t2",
                        "title": "Execute core logic",
                        "description": "Implementation of requested workflow steps",
                        "priority": "medium",
                        "depends_on": ["t1"],
                        "agent_role": "coder",
                        "estimated_tokens": 500,
                        "tools_required": []
                    }
                ],
                "execution_order": ["t1", "t2"]
            })
            tokens = 0
        else:
            raise exc
    data   = json.loads(raw)

    subtasks: list[SubTask] = []
    for st in data.get("subtasks", []):
        subtasks.append(SubTask(
            id=st.get("id", f"t{len(subtasks)+1}"),
            title=st.get("title", ""),
            description=st.get("description", ""),
            priority=TaskPriority(st.get("priority", "medium")),
            depends_on=st.get("depends_on", []),
            agent_role=st.get("agent_role", "analyst"),
            estimated_tokens=int(st.get("estimated_tokens", 500)),
            tools_required=st.get("tools_required", []),
        ))

    plan = ExecutionPlan(
        plan_id=f"plan_{uuid.uuid4().hex[:8]}",
        goal=req.goal,
        subtasks=subtasks,
        execution_order=data.get("execution_order", [s.id for s in subtasks]),
        estimated_total_tokens=sum(s.estimated_tokens for s in subtasks),
        strategy=data.get("strategy", "Sequential execution"),
        reasoning=data.get("reasoning", ""),
    )
    return PlanResponse(plan=plan, model=req.model, tokens_used=tokens)
