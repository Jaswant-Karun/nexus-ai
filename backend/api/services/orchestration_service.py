from __future__ import annotations

from uuid import uuid4

from schemas.orchestration import AgentStep, OrchestrationRequest, OrchestrationResponse, SolutionReport


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
	)


def execute_orchestration(request: OrchestrationRequest) -> OrchestrationResponse:
	plan = build_orchestration(request)
	domain = plan.domain

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