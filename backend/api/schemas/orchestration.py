from __future__ import annotations

from pydantic import BaseModel, Field


class OrchestrationRequest(BaseModel):
	problem: str = Field(min_length=10, max_length=4000)
	context: str | None = Field(default=None, max_length=4000)
	request_id: str | None = None


class AgentStep(BaseModel):
	name: str
	role: str
	status: str
	output: str


class OrchestrationResponse(BaseModel):
	request_id: str
	problem: str
	intent: str
	domain: str
	plan: list[str]
	agents: list[AgentStep]
	next_actions: list[str]


class SolutionReport(BaseModel):
	request_id: str
	title: str
	summary: str
	recommendation: str
	implementation_steps: list[str]
	cost_estimate: str
	risks: list[str]