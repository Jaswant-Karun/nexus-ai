/**
 * /api/ai/[...path]  — Transparent proxy to the FastAPI AI service.
 *
 * Correctly handles:
 *   - Regular JSON responses
 *   - Streaming SSE responses (text/event-stream)
 *   - Service-offline fallback with clear error
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

const AI_BASE = process.env.AI_SERVICE_URL ?? "http://localhost:8001";

type Params = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, { params }: Params): Promise<NextResponse | Response> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  const targetPath  = "/" + path.join("/");
  const searchStr   = req.nextUrl.search ?? "";
  const targetUrl   = `${AI_BASE}${targetPath}${searchStr}`;
  const isGet       = req.method === "GET" || req.method === "HEAD";

  let body: string | null = null;
  if (!isGet) {
    try { body = await req.text(); } catch { body = null; }
  }

  try {
    const upstream = await fetch(targetUrl, {
      method:  req.method,
      headers: {
        "Content-Type": "application/json",
        "Accept":       "text/event-stream, application/json, */*",
      },
      body:   body ?? undefined,
      signal: AbortSignal.timeout(120_000),
    });

    const contentType = upstream.headers.get("content-type") ?? "";

    // ── SSE / streaming response — pipe it through directly ──────────────
    if (contentType.includes("text/event-stream") && upstream.body) {
      return new Response(upstream.body, {
        status:  upstream.status,
        headers: {
          "Content-Type":     "text/event-stream",
          "Cache-Control":    "no-cache, no-transform",
          "Connection":       "keep-alive",
          "X-Accel-Buffering":"no",
        },
      });
    }

    // ── Regular JSON response ─────────────────────────────────────────────
    const data = await upstream.json().catch(() => ({ error: "Invalid JSON from AI service" }));
    return NextResponse.json(data, { status: upstream.status });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed") || msg.includes("connect")) {
      return NextResponse.json(
        {
          error:   "AI Service Offline",
          detail:  "Start it: cd backend/ai-service && uvicorn main:app --port 8001 --reload",
          service: targetUrl,
          offline: true,
        },
        { status: 503 }
      );
    }

    if (msg.includes("timeout") || msg.includes("abort") || msg.includes("TimeoutError")) {
      return NextResponse.json(
        { error: "AI Service Timeout", detail: "Request took longer than 120 seconds." },
        { status: 504 }
      );
    }

    return NextResponse.json({ error: "AI Service Error", detail: msg }, { status: 500 });
  }
}

export const GET    = proxy;
export const POST   = proxy;
export const PUT    = proxy;
export const PATCH  = proxy;
export const DELETE = proxy;
