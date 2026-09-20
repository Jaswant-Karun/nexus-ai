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
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  if (!body.conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: body.conversationId, userId: user.sub },
    select: { id: true },
  });
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const latestUserMessage = [...body.messages].reverse().find((message) => message.role === "user");
  if (!latestUserMessage?.content.trim()) {
    return NextResponse.json({ error: "A user message is required" }, { status: 400 });
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: latestUserMessage.content.trim(),
    },
  });
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

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

        let assistantContent = "";
        try {
          for await (const chunk of streamChat(body)) {
            send(chunk);

            if (chunk.type === "delta") assistantContent += chunk.content;

            // Stop early on terminal error.
            if (chunk.type === "error") break;
          }

          if (assistantContent.trim()) {
            await prisma.message.create({
              data: {
                conversationId: conversation.id,
                role: "assistant",
                content: assistantContent,
              },
            });
            await prisma.conversation.update({
              where: { id: conversation.id },
              data: { lastMessageAt: new Date() },
            });
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
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: response.content,
      },
    });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });
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
