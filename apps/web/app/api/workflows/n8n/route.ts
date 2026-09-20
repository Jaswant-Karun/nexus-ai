import { NextRequest, NextResponse } from "next/server";
import { checkN8nHealth, executeN8nAgent, executeN8nMultiAgent } from "@/lib/n8n";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/workflows/n8n
 * Health check & status of n8n engine.
 */
export async function GET() {
  const isHealthy = await checkN8nHealth();
  return NextResponse.json({
    engine: "n8n",
    status: isHealthy ? "ONLINE" : "STANDBY_OR_DOCKER_NOT_STARTED",
    webhookBase: "http://localhost:5678/webhook",
    templates: [
      { id: "nexus_agent_orchestrator", name: "Master Agent Orchestrator", webhook: "nexus-agent" },
      { id: "nexus_multi_agent_collaboration", name: "Multi-Agent Collaboration", webhook: "nexus-multi-agent" },
    ],
  });
}

/**
 * POST /api/workflows/n8n
 * Trigger an n8n workflow execution.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const { type, prompt, goal, agentId, model, systemPrompt } = body;

    if (type === "multi-agent") {
      const res = await executeN8nMultiAgent(goal || prompt || "Collaborative execution");
      return NextResponse.json(res);
    }

    // Default: Single agent orchestration
    const res = await executeN8nAgent({
      prompt: prompt || goal || "Execute agent task",
      agentId,
      model,
      systemPrompt,
      userId: user?.sub,
      organizationId: user?.orgId,
    });

    return NextResponse.json(res);
  } catch (err) {
    console.error("[n8n POST error]", err);
    return NextResponse.json({ success: false, error: "Failed to dispatch to n8n" }, { status: 500 });
  }
}
