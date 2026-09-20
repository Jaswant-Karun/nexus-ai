from __future__ import annotations

from pydantic import BaseModel, Field


class OrchestrationRequest(BaseModel):
    goal: str
    context: list[str] = Field(default_factory=list)
    constraints: list[str] = Field(default_factory=list)


class OrchestrationPlan(BaseModel):
    trace_id: str
    goal: str
    selected_agents: list[str]
    steps: list[str]
    notes: str