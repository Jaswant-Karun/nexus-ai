import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * GET /api/nexus-agent/export-training-data
 * Exports collected user conversation data formatted as standard JSONL for model fine-tuning and evaluation.
 * Query params:
 *   format: "alpaca" | "sharegpt" | "openai" (default: "alpaca")
 *   limit: number (default: 500)
 *   rating_filter: "all" | "positive_only" (default: "all")
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") ?? "alpaca";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "500", 10), 5000);
    const ratingFilter = searchParams.get("rating_filter") ?? "all";

    const where: any = {};
    if (ratingFilter === "positive_only") {
      where.rating = 1;
    }

    const samples = await prisma.chatTrainingSample.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const lines: string[] = [];

    for (const sample of samples) {
      if (format === "openai") {
        // OpenAI fine-tuning JSONL format
        lines.push(
          JSON.stringify({
            messages: [
              { role: "system", content: sample.systemPrompt ?? "You are NEXUS AI, an expert technical assistant." },
              { role: "user", content: sample.prompt },
              { role: "assistant", content: sample.response },
            ],
          })
        );
      } else if (format === "sharegpt") {
        // ShareGPT conversation format
        lines.push(
          JSON.stringify({
            conversations: [
              { from: "human", value: sample.prompt },
              { from: "gpt", value: sample.response },
            ],
          })
        );
      } else {
        // Standard Alpaca instruction format (ideal for Llama 3.2 fine-tuning with Unsloth / Hugging Face)
        lines.push(
          JSON.stringify({
            instruction: sample.prompt,
            input: "",
            output: sample.response,
            system: sample.systemPrompt ?? "You are NEXUS AI, an expert technical assistant.",
            metadata: {
              model: sample.model,
              domain: sample.domain,
              source: sample.source,
              rating: sample.rating,
              tokens: sample.tokensUsed,
              created_at: sample.createdAt.toISOString(),
            },
          })
        );
      }
    }

    const jsonlPayload = lines.join("\n");

    return new Response(jsonlPayload, {
      headers: {
        "Content-Type": "application/x-jsonlines; charset=utf-8",
        "Content-Disposition": `attachment; filename="nexus_training_data_${Date.now()}.jsonl"`,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to export training data" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
