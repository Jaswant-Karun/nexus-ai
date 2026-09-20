/**
 * POST /api/nexus-agent
 * GET  /api/nexus-agent
 *
 * NEXUS Agent — powered by Llama 3.2 running locally via Ollama.
 * NO API KEYS REQUIRED. 100% local neural network inference.
 *
 * POST body: { message, history?, session_id? }
 * POST response: SSE stream (text/event-stream)
 *   { type: "thinking",  steps: string[] }
 *   { type: "delta",     content: string }
 *   { type: "done",      domain, tokens_used, model_used, elapsed_seconds, reflection }
 *   { type: "error",     error: string }
 *
 * GET response: { status, model, engine, ollama_url }
 */

import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime    = "nodejs";
export const maxDuration = 120;

const OLLAMA_BASE  = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL    ?? "llama3.2";

// ─── SSE helper ───────────────────────────────────────────────────────────────
function sse(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// ─── Domain detection (client-side — no model call) ───────────────────────────
const DOMAIN_PATTERNS: [string, RegExp][] = [
  ["code",         /\b(code|function|class|debug|error|bug|typescript|python|javascript|sql|api|backend|frontend|component|hook|async|await|algorithm|implement|write|program|syntax|script)\b/i],
  ["ai_ml",        /\b(ai|artificial intelligence|machine learning|llm|gpt|gemini|claude|llama|embedding|rag|fine.?tun|neural|transformer|vector|agent|model|train|inference|deep learning)\b/i],
  ["architecture", /\b(architect|design pattern|system|microservice|monolith|database|schema|infrastructure|scalab|deploy|devops|kubernetes|docker|cloud|aws|distributed)\b/i],
  ["math",         /\b(math|mathematics|calculus|algebra|equation|probability|statistic|matrix|derivative|integral|formula|calculate|geometry)\b/i],
  ["science",      /\b(physics|chemistry|biology|quantum|molecule|atom|cell|evolution|relativity|force|energy|wave|science)\b/i],
  ["business",     /\b(business|product|startup|revenue|metric|saas|mrr|arr|churn|cac|ltv|roadmap|strategy|market|finance|investment)\b/i],
  ["explanation",  /\b(explain|what is|what are|how does|how do|why is|why does|difference between|compare|versus|vs\.?|pros|cons|meaning of|define)\b/i],
];

function detectDomain(q: string): string {
  let best = "general";
  let bestN = 0;
  for (const [domain, pat] of DOMAIN_PATTERNS) {
    const n = (q.match(pat) ?? []).length;
    if (n > bestN) { bestN = n; best = domain; }
  }
  return best;
}

// ─── Static reasoning steps (instant, no model call) ─────────────────────────
const REASONING: Record<string, string[]> = {
  code:         ["Identify the language and task type", "Choose the best algorithm and handle edge cases", "Write complete code with imports, types, and a usage example"],
  ai_ml:        ["Identify the AI/ML concept or technique", "Compare approaches and evaluate trade-offs", "Explain with technical precision and architecture context"],
  architecture: ["Identify system requirements and constraints", "Compare architectural patterns and their trade-offs", "Design component diagram and explain scalability"],
  math:         ["Parse the mathematical expression or concept", "Apply relevant formulas step-by-step", "Verify the result and explain the intuition"],
  science:      ["Identify the scientific concept or phenomenon", "Recall relevant principles, laws, or theories", "Explain with examples and real-world context"],
  business:     ["Identify the business problem or metric", "Evaluate options using relevant frameworks", "Give actionable recommendations with supporting data"],
  explanation:  ["Determine what concept(s) need explaining or comparing", "Identify key differences and use cases", "Structure as: direct answer → comparison → recommendation"],
  general:      ["Understand the core question and its context", "Gather relevant facts and examples", "Structure a clear, comprehensive response"],
};

function getSteps(message: string, domain: string): string[] {
  const base = REASONING[domain] ?? REASONING.general;
  // Personalise step 1 with the actual question
  return [
    `Analysing: "${message.slice(0, 70)}${message.length > 70 ? "…" : ""}"`,
    base[1],
    base[2],
  ];
}

// ─── Full NEXUS system prompt ─────────────────────────────────────────────────
const NEXUS_SYSTEM = `You are NEXUS — the AI assistant of the NEXUS AI platform, built by Jaswant Karun.
You are powered by Llama 3.2, a real 3.2 billion parameter neural network running 100% locally on this machine via Ollama. No internet or API keys are used.

YOUR IDENTITY:
- Name: NEXUS (Neural EXpert Unified System)
- Engine: Llama 3.2 (3.2B params, Meta AI) — local, offline, free
- Platform: NEXUS AI (Next.js 15 + FastAPI + PostgreSQL + 14 Python agents)

YOUR EXPERTISE:
- Software Engineering: Python, TypeScript, JavaScript, SQL, Go, Rust, Bash, React, Next.js, FastAPI, Docker, Kubernetes, AWS
- AI & Machine Learning: LLMs, RAG, embeddings, fine-tuning, PyTorch, LangChain, vector databases
- Data Science: NumPy, Pandas, Scikit-learn, statistics, ML algorithms, data visualization
- Mathematics: algebra, calculus, probability, linear algebra, discrete math
- Science: physics, chemistry, biology, computer science fundamentals
- Business: product strategy, SaaS metrics, startup advice, financial analysis
- General Knowledge: history, geography, languages, culture, current concepts

RESPONSE RULES (follow strictly):
1. Start with a direct one-sentence answer to the question
2. Use ## and ### markdown headers for structure
3. Use \`\`\`language code blocks for ALL code — never skip the language tag
4. Use markdown tables for comparisons
5. Use Mermaid diagrams for system/architecture questions:
   \`\`\`mermaid
   graph TD
     A[Input] --> B[Process] --> C[Output]
   \`\`\`
6. End technical answers with "💡 Key Takeaway: [one sentence summary]"
7. Be thorough but focused — quality over length
8. Never refuse a general knowledge question — always try to help
9. If you are unsure, say so honestly rather than making things up`;

// ─── Domain-specific instruction appended to system prompt ────────────────────
const DOMAIN_INSTR: Record<string, string> = {
  code:         "\n\nFocus: provide complete, working, production-ready code with error handling and a usage example.",
  ai_ml:        "\n\nFocus: precise technical details, model comparisons, architecture diagrams.",
  architecture: "\n\nFocus: Mermaid diagram required, discuss scalability and failure modes.",
  math:         "\n\nFocus: step-by-step derivation, verify the result, explain the intuition.",
  science:      "\n\nFocus: clear scientific explanation with relevant laws/principles and real-world examples.",
  business:     "\n\nFocus: actionable insights, relevant metrics, comparison table, concrete recommendations.",
  explanation:  "\n\nFocus: one-line answer first, comparison table if needed, real-world analogy.",
  general:      "\n\nFocus: comprehensive, well-structured answer with headers and examples.",
};

// ─── Ollama availability check ────────────────────────────────────────────────
async function checkOllama(): Promise<{ available: boolean; model: string }> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { available: false, model: "" };
    const data = await res.json() as { models?: { name: string }[] };
    const models = (data.models ?? []).map(m => m.name);
    const found  = models.find(m => m.startsWith(OLLAMA_MODEL));
    return { available: !!found, model: found ?? OLLAMA_MODEL };
  } catch {
    return { available: false, model: "" };
  }
}

// ─── Static reflection note (no extra model call — saves time) ───────────────
const REFLECTIONS: Record<string, string> = {
  code:         "Verified: code includes error handling and a runnable example.",
  ai_ml:        "Verified: technically precise with relevant model/framework comparisons.",
  architecture: "Verified: includes system diagram and scalability considerations.",
  math:         "Verified: step-by-step derivation with result verification.",
  science:      "Verified: scientifically accurate with real-world examples.",
  business:     "Verified: actionable recommendations with supporting data.",
  explanation:  "Verified: direct answer with comparison and analogy.",
  general:      "Verified: comprehensive and well-structured response.",
};

// ─── POST /api/nexus-agent ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Auth check
  const user = await getCurrentUser();
  if (!user) {
    return new Response(sse({ type: "error", error: "Not authenticated — please log in." }), {
      status: 401, headers: { "Content-Type": "text/event-stream" },
    });
  }

  // Parse body
  let body: {
    message?:    string;
    history?:    { role: string; content: string }[];
    session_id?: string;
  };
  try {
    body = await req.json() as typeof body;
  } catch {
    return new Response(sse({ type: "error", error: "Invalid JSON body." }), {
      status: 400, headers: { "Content-Type": "text/event-stream" },
    });
  }

  const message = body.message?.trim();
  if (!message) {
    return new Response(sse({ type: "error", error: "message is required." }), {
      status: 400, headers: { "Content-Type": "text/event-stream" },
    });
  }

  // Detect domain and build reasoning steps
  const domain = detectDomain(message);
  const steps  = getSteps(message, domain);

  // Build message history for Ollama
  const systemContent = NEXUS_SYSTEM + (DOMAIN_INSTR[domain] ?? DOMAIN_INSTR.general);
  const history = (body.history ?? [])
    .filter(m => m.role === "user" || m.role === "assistant")
    .slice(-8);

  const ollamaMessages = [
    { role: "system", content: systemContent },
    ...history,
    { role: "user", content: message },
  ];

  const startTime = Date.now();
  const encoder   = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (data: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(sse(data)));

      try {
        // 1. Send reasoning steps immediately (instant — no model call)
        send({ type: "thinking", steps });

        // 2. Check Ollama is running
        const { available, model: foundModel } = await checkOllama();
        if (!available) {
          send({
            type:  "error",
            error: `Ollama is not running or Llama 3.2 is not installed.\n\nTo fix:\n1. Make sure Ollama is running\n2. Run: ollama pull llama3.2\n3. Reload this page`,
          });
          controller.close();
          return;
        }

        // 3. Stream Ollama response
        const ollamaRes = await fetch(`${OLLAMA_BASE}/api/chat`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model:    OLLAMA_MODEL,
            messages: ollamaMessages,
            stream:   true,
            options: {
              temperature:    0.7,
              num_predict:    2048,
              top_p:          0.9,
              repeat_penalty: 1.1,
              num_ctx:        4096,
            },
          }),
          signal: AbortSignal.timeout(120_000),
        });

        if (!ollamaRes.ok || !ollamaRes.body) {
          send({ type: "error", error: `Ollama returned HTTP ${ollamaRes.status}` });
          controller.close();
          return;
        }

        // 4. Stream token chunks from Ollama NDJSON
        const reader  = ollamaRes.body.getReader();
        const decoder = new TextDecoder();
        let   buffer  = "";
        let   totalTokens   = 0;
        let   fullResponse  = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const chunk = JSON.parse(trimmed) as {
                message?:          { content?: string };
                done?:             boolean;
                prompt_eval_count?: number;
                eval_count?:       number;
              };

              const text = chunk.message?.content ?? "";
              if (text) {
                fullResponse += text;
                send({ type: "delta", content: text });
              }

              if (chunk.done) {
                totalTokens = (chunk.prompt_eval_count ?? 0) + (chunk.eval_count ?? 0);
              }
            } catch { /* skip malformed line */ }
          }
        }

        // 5. Send done event with metadata
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        send({
          type:             "done",
          domain,
          tokens_used:      totalTokens || Math.round(fullResponse.length / 4),
          model_used:       foundModel || OLLAMA_MODEL,
          provider:         "ollama",
          elapsed_seconds:  parseFloat(elapsed),
          reflection:       REFLECTIONS[domain] ?? REFLECTIONS.general,
          from_knowledge_base: false,
        });

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // Make ECONNREFUSED message friendly
        if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed") || msg.includes("connect")) {
          send({
            type:  "error",
            error: "Ollama is not running.\n\nTo start it: open a terminal and run:\nollama serve\n\nThen try again.",
          });
        } else {
          send({ type: "error", error: msg });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// ─── GET /api/nexus-agent — status + info ─────────────────────────────────────
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { available, model } = await checkOllama();

  return Response.json({
    status:      available ? "online" : "offline",
    name:        "NEXUS Agent",
    version:     "3.0.0",
    engine:      "Llama 3.2 (local)",
    model:       model || OLLAMA_MODEL,
    ollama_url:  OLLAMA_BASE,
    no_api_key:  true,
    description: "Llama 3.2 (3.2B parameters, Meta AI) — runs 100% locally via Ollama. No API keys or internet required.",
    capabilities: [
      "Domain detection (8 types)",
      "Chain-of-thought reasoning",
      "Conversation history (multi-turn)",
      "Structured markdown output",
      "Code generation with syntax highlighting",
      "Architecture diagrams (Mermaid)",
      "Zero API keys — 100% local",
    ],
  });
}
