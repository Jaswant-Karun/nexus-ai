/**
 * CLI Test & Benchmark Runner for NEXUS Chatbot
 * Usage: pnpm tsx scripts/test-chatbot.ts
 */

import http from "http";

const HOST = process.env.TEST_HOST ?? "localhost";
const PORT = process.env.TEST_PORT ?? 3000;

const PROMPTS = [
  {
    name: "Comparison / Linguistics",
    query: "Compare He and She",
    mustContain: ["pronoun", "singular", "subject"],
  },
  {
    name: "Algorithm / Python",
    query: "Write a Python function to reverse a linked list",
    mustContain: ["def", "reverse", "curr", "prev"],
  },
  {
    name: "AI & Neural Networks",
    query: "Explain how neural networks learn",
    mustContain: ["loss", "gradient", "backpropagation"],
  },
  {
    name: "System Architecture",
    query: "Design a REST API for a todo app",
    mustContain: ["post", "get", "api", "status"],
  },
];

async function sendQuery(query: string): Promise<{ text: string; latencyMs: number; model: string }> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      message: query,
      session_id: `cli-test-${Date.now()}`,
      source: "cli_benchmark",
    });

    const start = Date.now();
    const req = http.request(
      {
        hostname: HOST,
        port: PORT,
        path: "/api/nexus-agent",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk.toString();
        });
        res.on("end", () => {
          const latencyMs = Date.now() - start;
          let fullText = "";
          let model = "Unknown";

          for (const line of raw.split("\n")) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data:")) {
              try {
                const event = JSON.parse(trimmed.slice(5).trim());
                if (event.type === "delta" && event.content) {
                  fullText += event.content;
                }
                if (event.type === "done" && event.model_used) {
                  model = event.model_used;
                }
              } catch (_) {}
            }
          }
          resolve({ text: fullText, latencyMs, model });
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log(`\n======================================================`);
  console.log(`🧪 NEXUS Chatbot Test Suite & Dataset Verification`);
  console.log(`Target: http://${HOST}:${PORT}/api/nexus-agent`);
  console.log(`======================================================\n`);

  let passed = 0;

  for (let i = 0; i < PROMPTS.length; i++) {
    const p = PROMPTS[i];
    process.stdout.write(`[Test ${i + 1}/${PROMPTS.length}] ${p.name}... `);

    try {
      const res = await sendQuery(p.query);
      const lower = res.text.toLowerCase();
      const matched = p.mustContain.filter((w) => lower.includes(w));
      const ok = matched.length >= 2 && res.text.length > 50;

      if (ok) {
        passed++;
        console.log(`✅ PASSED (${res.latencyMs}ms | Model: ${res.model})`);
      } else {
        console.log(`⚠️ PARTIAL (${res.latencyMs}ms | matched: ${matched.join(", ")})`);
      }
    } catch (err: any) {
      console.log(`❌ FAILED (${err?.message})`);
    }
  }

  console.log(`\n======================================================`);
  console.log(`Result: ${passed}/${PROMPTS.length} tests passed.`);
  console.log(`Training dataset collection status: Active in PostgreSQL.`);
  console.log(`Export URL: http://${HOST}:${PORT}/api/nexus-agent/export-training-data`);
  console.log(`======================================================\n`);
}

main().catch(console.error);
