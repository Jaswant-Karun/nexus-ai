from __future__ import annotations

from uuid import uuid4

from schemas.orchestration import OrchestrationPlan, OrchestrationRequest


def build_orchestration_plan(request: OrchestrationRequest) -> OrchestrationPlan:
    goal = request.goal.lower()
    selected_agents = ["planner-agent"]

    if any(keyword in goal for keyword in ("research", "discover", "analyze")):
        selected_agents.append("research-agent")
    if any(keyword in goal for keyword in ("validate", "verify", "review")):
        selected_agents.append("validator-agent")
    if any(keyword in goal for keyword in ("summarize", "report", "publish")):
        selected_agents.append("summarizer-agent")

    steps = [
        f"Clarify objective: {request.goal}",
        "Collect supporting context and constraints",
        "Route work to the selected agents",
        "Validate outputs before publishing",
    ]

    if request.constraints:
        steps.insert(2, f"Respect constraints: {', '.join(request.constraints)}")

    return OrchestrationPlan(
        trace_id=str(uuid4()),
        goal=request.goal,
        selected_agents=selected_agents,
        steps=steps,
        notes="Planned by the orchestration service using lightweight keyword routing.",
    )