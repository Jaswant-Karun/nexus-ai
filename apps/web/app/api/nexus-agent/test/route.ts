import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

const TEST_SUITE = [
  {
    name: "Linguistic & Conceptual Comparison",
    prompt: "Compare He and She with a markdown matrix",
    expectedKeywords: ["Pronoun", "Subject", "Object", "Possessive", "matrix"],
  },
  {
    name: "Algorithmic Code Generation",
    prompt: "Write a Python function to reverse a singly linked list in-place",
    expectedKeywords: ["def reverse", "curr", "prev", "next", "ListNode"],
  },
  {
    name: "AI & Machine Learning Reasoning",
    prompt: "Explain how neural networks learn with backpropagation and loss",
    expectedKeywords: ["Forward", "Loss", "Backpropagation", "Gradient", "Weights"],
  },
  {
    name: "System Architecture & REST API Design",
    prompt: "Design a RESTful API contract for a task management service",
    expectedKeywords: ["POST", "GET", "PUT", "DELETE", "HTTP", "status"],
  },
];

/**
 * POST /api/nexus-agent/test
 * Runs test prompts against the live chatbot pipeline and benchmarks accuracy, response length, and latency.
 */
export async function POST(req: NextRequest) {
  const host = req.headers.get("host") ?? "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") ?? "http";
  const agentUrl = `${protocol}://${host}/api/nexus-agent`;

  const results: any[] = [];
  let passedCount = 0;

  for (const testCase of TEST_SUITE) {
    const start = Date.now();
    try {
      const res = await fetch(agentUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: testCase.prompt,
          session_id: `test-runner-${Date.now()}`,
          source: "automated_test_runner",
        }),
      });

      if (!res.ok) {
        results.push({
          name: testCase.name,
          prompt: testCase.prompt,
          passed: false,
          error: `HTTP ${res.status}`,
          latencyMs: Date.now() - start,
        });
        continue;
      }

      const text = await res.text();
      const latencyMs = Date.now() - start;

      // Extract deltas from SSE stream
      let fullContent = "";
      for (const line of text.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data:")) {
          try {
            const data = JSON.parse(trimmed.slice(5).trim());
            if (data.type === "delta" && data.content) {
              fullContent += data.content;
            }
          } catch (_) {}
        }
      }

      // Check keywords
      const matched = testCase.expectedKeywords.filter(kw =>
        fullContent.toLowerCase().includes(kw.toLowerCase())
      );
      const isPassed = matched.length >= 2 && fullContent.length > 50;

      if (isPassed) passedCount++;

      results.push({
        name: testCase.name,
        prompt: testCase.prompt,
        passed: isPassed,
        latencyMs,
        responseLength: fullContent.length,
        matchedKeywords: matched,
        samplePreview: fullContent.slice(0, 140) + "...",
      });
    } catch (err: any) {
      results.push({
        name: testCase.name,
        prompt: testCase.prompt,
        passed: false,
        error: err?.message,
        latencyMs: Date.now() - start,
      });
    }
  }

  const successRate = ((passedCount / TEST_SUITE.length) * 100).toFixed(0);

  return NextResponse.json({
    status: passedCount === TEST_SUITE.length ? "HEALTHY" : "DEGRADED",
    total_tests: TEST_SUITE.length,
    passed_tests: passedCount,
    success_rate: `${successRate}%`,
    timestamp: new Date().toISOString(),
    tests: results,
  }, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
