/**
 * /api/ai/[...path]  — Transparent proxy to the FastAPI AI service.
 *
 * All frontend pages call /api/ai/... instead of http://localhost:8001/...
 * so requests go server-side (no CORS issues, no browser firewall issues).
 *
 * GET  /api/ai/health                          → localhost:8001/health
 * POST /api/ai/api/v1/agents/run               → localhost:8001/api/v1/agents/run
 * POST /api/ai/api/v1/summarizer/summarize     → etc.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

const AI_BASE = process.env.AI_SERVICE_URL ?? "http://localhost:8001";

type Params = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, { params }: Params): Promise<NextResponse> {
  // Auth check — only authenticated users can use the AI service
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  const targetPath = "/" + path.join("/");

  // Forward query string
  const searchStr = req.nextUrl.search ?? "";
  const targetUrl = `${AI_BASE}${targetPath}${searchStr}`;

  const isGet  = req.method === "GET" || req.method === "HEAD";
  let body: BodyInit | null = null;

  if (!isGet) {
    try {
      body = await req.text();
    } catch {
      body = null;
    }
  }

  try {
    const upstream = await fetch(targetUrl, {
      method:  req.method,
      headers: {
        "Content-Type": "application/json",
        "Accept":       "application/json",
      },
      body: body ?? undefined,
      // 60 s timeout for long LLM calls
      signal: AbortSignal.timeout(60_000),
    });

    const data = await upstream.json().catch(() => ({ error: "Invalid JSON from AI service" }));

    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    // Connection refused — service not running
    if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed") || msg.includes("connect")) {
      return NextResponse.json(
        {
          error:   "AI Service Offline",
          detail:  "The NEXUS AI Service is not running. Start it with: cd backend/ai-service && uvicorn main:app --port 8001 --reload",
          service: `${AI_BASE}${targetPath}`,
        },
        { status: 503 }
      );
    }

    // Timeout
    if (msg.includes("timeout") || msg.includes("abort") || msg.includes("TimeoutError")) {
      return NextResponse.json(
        { error: "AI Service Timeout", detail: "The request took longer than 60 seconds." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "AI Service Error", detail: msg },
      { status: 500 }
    );
  }
}

export const GET    = proxy;
export const POST   = proxy;
export const PUT    = proxy;
export const PATCH  = proxy;
export const DELETE = proxy;
