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


class WorkflowNode(BaseModel):
	id: str
	name: str
	kind: str
	status: str
	depends_on: list[str] = Field(default_factory=list)


class EvidenceItem(BaseModel):
	title: str
	source: str
	relevance: str


class WorkflowExecutionState(BaseModel):
	workflow_id: str
	execution_id: str
	status: str
	current_node: str | None = None
	completed_nodes: list[str] = Field(default_factory=list)
	failed_nodes: list[str] = Field(default_factory=list)
	start_time: str
	end_time: str | None = None
	agent_outputs: dict[str, str] = Field(default_factory=dict)
	errors: list[str] = Field(default_factory=list)
	metrics: dict[str, float] = Field(default_factory=dict)
	final_output: str | None = None


class OrchestrationResponse(BaseModel):
	request_id: str
	problem: str
	intent: str
	domain: str
	plan: list[str]
	agents: list[AgentStep]
	next_actions: list[str]
	complexity: str
	selected_tools: list[str]
	rag_required: bool
	memory_required: bool
	external_search_required: bool
	validation_required: bool
	workflow: list[WorkflowNode]
	evidence: list[EvidenceItem]
	decision_factors: list[str]
	assumptions: list[str]
	confidence: int = Field(ge=0, le=100)
	validation_status: str
	execution: WorkflowExecutionState


class SolutionReport(BaseModel):
	request_id: str
	title: str
	summary: str
	recommendation: str
	implementation_steps: list[str]
	cost_estimate: str
	risks: list[str]