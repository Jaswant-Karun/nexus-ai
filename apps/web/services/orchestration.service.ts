export interface OrchestrationRequest {
  problem: string;
  context?: string;
}

export interface AgentStep {
  name: string;
  role: string;
  status: string;
  output: string;
}

export interface OrchestrationResponse {
  request_id: string;
  problem: string;
  intent: string;
  domain: string;
  plan: string[];
  agents: AgentStep[];
  next_actions: string[];
}

export interface SolutionReport {
  request_id: string;
  title: string;
  summary: string;
  recommendation: string;
  implementation_steps: string[];
  cost_estimate: string;
  risks: string[];
}

export async function createOrchestrationPlan(
  request: OrchestrationRequest,
): Promise<OrchestrationResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/v1/orchestration/plan`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error("The orchestration service could not create a plan.");
  }

  return response.json() as Promise<OrchestrationResponse>;
}

export async function executeAgentCouncil(
  request: OrchestrationRequest,
): Promise<OrchestrationResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/v1/orchestration/execute`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error("The agent council could not be executed.");
  }

  return response.json() as Promise<OrchestrationResponse>;
}

export async function generateSolutionReport(
  request: OrchestrationRequest,
): Promise<SolutionReport> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/v1/orchestration/report`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error("The solution report could not be generated.");
  }

  return response.json() as Promise<SolutionReport>;
}
