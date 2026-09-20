import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

const AI_BASE = process.env.AI_SERVICE_URL ?? "http://localhost:8001";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null) as { query?: string; topK?: number } | null;
  const query = body?.query?.trim();
  if (!query) return NextResponse.json({ success: false, error: "query is required" }, { status: 400 });

  const topK = Math.min(Math.max(body?.topK ?? 5, 1), 20);
  try {
    const response = await fetch(`${AI_BASE}/api/v1/vector-search/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        collection: `nexus_docs_${user.orgId}`,
        query,
        top_k: topK,
        filters: { organizationId: user.orgId },
      }),
      signal: AbortSignal.timeout(30_000),
    });
    const data = await response.json().catch(() => ({ error: "Invalid response from AI service" }));
    return NextResponse.json({ success: response.ok, ...data }, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      success: false,
      error: message.includes("fetch failed") ? "AI service is offline" : "Knowledge search failed",
    }, { status: 503 });
  }
}