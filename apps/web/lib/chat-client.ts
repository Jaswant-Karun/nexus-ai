/**
 * NEXUS AI — Client-side chat helper.
 *
 * Calls the /api/chat endpoint and provides both streaming (SSE) and
 * non-streaming interfaces for React components.
 */

import type { ChatRequest, ChatResponse, StreamChunk } from "./ai/types";

/**
 * Stream a chat response as an async generator of StreamChunk objects.
 * Usage:
 *   for await (const chunk of streamChat(req)) {
 *     if (chunk.type === "delta") setContent(c => c + chunk.content);
 *     if (chunk.type === "done")  setMeta({ model: chunk.model, ... });
 *   }
 */
export async function* streamChat(
  req: ChatRequest,
): AsyncGenerator<StreamChunk, void, unknown> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...req, stream: true }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({
      error: res.statusText,
    }))) as { error?: string; detail?: string };
    throw new Error(err.error ?? err.detail ?? `Chat failed (${res.status})`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response stream");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE events are separated by blank lines.
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const data = event.trim();
      if (!data.startsWith("data: ")) continue;
      try {
        const chunk = JSON.parse(data.slice(6)) as StreamChunk;
        yield chunk;
      } catch {
        // skip malformed
      }
    }
  }
}

/**
 * Non-streaming chat request.  Returns the full response as JSON.
 */
export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...req, stream: false }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({
      error: res.statusText,
    }))) as { error?: string; detail?: string };
    throw new Error(err.error ?? err.detail ?? `Chat failed (${res.status})`);
  }

  return res.json();
}
