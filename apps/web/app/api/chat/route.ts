/**
 * POST /api/chat
 *
 * Multi-model chat endpoint with Nexus Auto routing, fallback, and streaming.
 *
 * Body (ChatRequest):
 *   { model, messages, temperature?, maxTokens?, stream?, systemPrompt?, tools? }
 *
 * - model: "auto" for Nexus Auto routing, or a catalog model id (e.g. "gpt-5").
 * - stream: true → returns SSE stream of StreamChunk objects.
 *           false (default) → returns JSON ChatResponse.
 *
 * No auth required — API keys are server-side only.  In production, wrap with
 * getCurrentUser() to gate access.
 */

import { NextRequest, NextResponse } from "next/server";
import { chat, streamChat, anyProvidersConfigured } from "@/lib/ai/nexus";
import type { ChatRequest as NexusChatRequest } from "@/lib/ai/types";
import { ProviderError } from "@/lib/ai/errors";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  let body: NexusChatRequest;
  try {
    body = (await req.json()) as NexusChatRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  // Basic validation
  if (!body.messages?.length) {
    return NextResponse.json(
      { error: "messages array is required and must not be empty" },
      { status: 400 },
    );
  }

  if (!body.model) {
    return NextResponse.json(
      { error: 'model is required (use "auto" or a catalog model id)' },
      { status: 400 },
    );
  }

  // Quick "no providers" check — gives a clean message instead of a stream error.
  if (!anyProvidersConfigured()) {
    return NextResponse.json(
      {
        error: "No AI providers configured",
        detail:
          "Add API keys to apps/web/.env.local: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_AI_API_KEY, XAI_API_KEY, DEEPSEEK_API_KEY",
      },
      { status: 503 },
    );
  }

  // ── Streaming response (SSE) ──
  if (body.stream) {
    const encoder = new TextEncoder();

    const sseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (obj: unknown) =>
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(obj)}\n\n`),
          );

        try {
          for await (const chunk of streamChat(body)) {
            send(chunk);

            // Stop early on terminal error.
            if (chunk.type === "error") break;
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          send({ type: "error", error: msg });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(sseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  // ── Non-streaming response (JSON) ──
  try {
    const response = await chat(body);
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof ProviderError) {
      return NextResponse.json(
        { error: err.message, status: err.status, reason: err.reason },
        { status: err.status },
      );
    }
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
