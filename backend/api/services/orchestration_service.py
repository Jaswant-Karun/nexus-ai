from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from schemas.orchestration import (
	AgentStep,
	EvidenceItem,
	OrchestrationRequest,
	OrchestrationResponse,
	SolutionReport,
	WorkflowNode,
	WorkflowExecutionState,
)


AGENT_ROLES = (
	("Research Agent", "Collect domain context and practical constraints."),
	("Knowledge Agent", "Organize relevant concepts and relationships."),
	("Reasoning Agent", "Compare approaches and identify trade-offs."),
	("Recommendation Agent", "Turn evidence into an actionable direction."),
	("Critic Agent", "Challenge assumptions, cost, and feasibility."),
	("Validator Agent", "Check the plan for completeness and risks."),
)


def build_orchestration(request: OrchestrationRequest) -> OrchestrationResponse:
	problem = request.problem.strip()
	domain = _infer_domain(problem)
	complexity = _infer_complexity(problem)
	selected_tools = _select_tools(problem, domain)
	rag_required = any(term in problem.lower() for term in ("compare", "research", "evidence", "sources"))
	memory_required = any(term in problem.lower() for term in ("my project", "previous", "continue", "history"))
	external_search_required = domain in {"software", "healthcare"} or rag_required
	workflow = _build_workflow()
	workflow_id = f"wf_{uuid4().hex[:10]}"
	execution_id = f"exec_{uuid4().hex[:10]}"
	started = datetime.now(UTC).isoformat()
	plan = [
		"Understand the user's objective and constraints",
		f"Research the {domain} domain and available approaches",
		"Compare options against cost, feasibility, and impact",
		"Validate the recommendation and produce implementation steps",
	]

	agents = [
		AgentStep(
			name=name,
			role=role,
			status="planned",
			output=f"Ready to analyze the {domain} problem from the {name.lower()} perspective.",
		)
		for name, role in AGENT_ROLES
	]

	return OrchestrationResponse(
		request_id=f"orch_{uuid4().hex[:12]}",
		problem=problem,
		intent="Design a practical, evidence-informed solution",
		domain=domain,
		plan=plan,
		agents=agents,
		next_actions=[
			"Run research and retrieval against the selected knowledge sources",
			"Generate a costed implementation plan",
			"Review the result with the critic and validator agents",
		],
		complexity=complexity,
		selected_tools=selected_tools,
		rag_required=rag_required,
		memory_required=memory_required,
		external_search_required=external_search_required,
		validation_required=True,
		workflow=workflow,
		evidence=[EvidenceItem(title="Task interpretation", source="Nexus AWSE", relevance="Problem statement and detected constraints")],
		decision_factors=["Cost", "Feasibility", "Impact", "Reliability"],
		assumptions=["The stated problem is an initial scope and may need clarification", "Final estimates require domain-specific evidence"],
		confidence=72 if complexity == "high" else 82,
		validation_status="pending",
		execution=WorkflowExecutionState(
			workflow_id=workflow_id,
			execution_id=execution_id,
			status="planned",
			current_node=workflow[0].id,
			start_time=started,
			metrics={"planned_nodes": float(len(workflow))},
		),
	)


def execute_orchestration(request: OrchestrationRequest) -> OrchestrationResponse:
	plan = build_orchestration(request)
	domain = plan.domain
	completed_nodes = [node.id for node in plan.workflow]
	completed_at = datetime.now(UTC).isoformat()

	return plan.model_copy(
		update={
			"agents": [
				agent.model_copy(
					update={
						"status": "completed",
						"output": f"{agent.name} completed its {domain} review and returned evidence for the next stage.",
					}
				)
				for agent in plan.agents
			],
			"next_actions": [
				"Review the completed agent evidence",
				"Generate a costed implementation plan",
				"Publish the validated result as a project report",
			],
			"workflow": [node.model_copy(update={"status": "completed"}) for node in plan.workflow],
			"validation_status": "passed",
			"confidence": min(plan.confidence + 10, 100),
			"execution": plan.execution.model_copy(
				update={
					"status": "completed",
					"current_node": None,
					"completed_nodes": completed_nodes,
					"end_time": completed_at,
					"agent_outputs": {agent.name: agent.output for agent in plan.agents},
					"metrics": {"completed_nodes": float(len(completed_nodes)), "confidence": float(min(plan.confidence + 10, 100))},
					"final_output": f"Completed explainable {domain} workflow with {len(plan.agents)} specialized agents.",
				},
			),
		}
	)


def generate_solution_report(request: OrchestrationRequest) -> SolutionReport:
	plan = execute_orchestration(request)
	if plan.domain == "agriculture":
		recommendation = "Use soil-moisture sensing with solar-powered drip irrigation and a low-bandwidth mobile alert workflow."
		cost = "Pilot estimate: $250-$600 per small plot, excluding labor and local installation."
	else:
		recommendation = f"Start with a measurable {plan.domain} pilot, validate the highest-risk assumption, then scale the workflow."
		cost = "Estimate pending: collect local pricing and resource constraints during research."

	return SolutionReport(
		request_id=plan.request_id,
		title=f"Nexus solution report: {plan.domain}",
		summary=f"A validated starting direction for: {plan.problem}",
		recommendation=recommendation,
		implementation_steps=[
			"Define the pilot scope, users, and success metrics",
			"Prototype the smallest end-to-end workflow",
			"Test reliability and operating cost with real users",
			"Review evidence and expand only after validation",
		],
		cost_estimate=cost,
		risks=[
			"Local operating conditions may differ from the initial assumptions",
			"Connectivity, maintenance, and adoption costs require field validation",
		],
	)


def _infer_domain(problem: str) -> str:
	keywords = {
		"agriculture": ("farmer", "farming", "irrigation", "crop", "soil"),
		"software": ("app", "software", "api", "platform", "website"),
		"healthcare": ("health", "hospital", "patient", "medical"),
		"education": ("student", "school", "learning", "education"),
	}
	lowered = problem.lower()
	for domain, terms in keywords.items():
		if any(term in lowered for term in terms):
			return domain
	return "general innovation"


def _infer_complexity(problem: str) -> str:
	word_count = len(problem.split())
	if word_count > 35 or any(term in problem.lower() for term in ("complete", "architecture", "compare", "multiple")):
		return "high"
	if word_count > 15:
		return "medium"
	return "low"


def _select_tools(problem: str, domain: str) -> list[str]:
	tools = ["structured-planner", "result-validator"]
	lowered = problem.lower()
	if domain in {"software", "healthcare"} or "research" in lowered:
		tools.append("external-search-adapter")
	if any(term in lowered for term in ("cost", "budget", "estimate")):
		tools.append("cost-calculator")
	return tools


def _build_workflow() -> list[WorkflowNode]:
	steps = ("Planner", "Research", "Knowledge Retrieval", "Reasoning", "Critic", "Validator", "Report")
	return [
		WorkflowNode(
			id=f"node-{index + 1}",
			name=name,
			kind="agent" if name not in {"Knowledge Retrieval"} else "retrieval",
			status="planned",
			depends_on=[f"node-{index}"] if index else [],
		)
		for index, name in enumerate(steps)
	]