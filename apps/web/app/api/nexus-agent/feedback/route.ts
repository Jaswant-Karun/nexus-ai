import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

/**
 * POST /api/nexus-agent/feedback
 * Records user feedback (thumbs up / thumbs down + comments) for model dataset training
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      sample_id?: string;
      rating: number; // 1 = positive (thumbs up), -1 = negative (thumbs down)
      feedback?: string;
      session_id?: string;
    };

    if (body.rating !== 1 && body.rating !== -1) {
      return NextResponse.json(
        { success: false, error: "Rating must be 1 (positive) or -1 (negative)." },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (body.sample_id) {
      const updated = await prisma.chatTrainingSample.update({
        where: { id: body.sample_id },
        data: {
          rating: body.rating,
          feedback: body.feedback ?? null,
        },
      });
      return NextResponse.json(
        { success: true, id: updated.id, rating: updated.rating },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (body.session_id) {
      const latest = await prisma.chatTrainingSample.findFirst({
        where: { sessionId: body.session_id },
        orderBy: { createdAt: "desc" },
      });
      if (latest) {
        const updated = await prisma.chatTrainingSample.update({
          where: { id: latest.id },
          data: {
            rating: body.rating,
            feedback: body.feedback ?? null,
          },
        });
        return NextResponse.json(
          { success: true, id: updated.id, rating: updated.rating },
          { headers: { "Access-Control-Allow-Origin": "*" } }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Sample not found to record feedback." },
      { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to record feedback" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

/**
 * GET /api/nexus-agent/feedback
 * Returns metrics and stats of collected data
 */
export async function GET() {
  try {
    const totalSamples = await prisma.chatTrainingSample.count();
    const positiveCount = await prisma.chatTrainingSample.count({ where: { rating: 1 } });
    const negativeCount = await prisma.chatTrainingSample.count({ where: { rating: -1 } });

    return NextResponse.json({
      success: true,
      total_collected_samples: totalSamples,
      positive_feedback: positiveCount,
      negative_feedback: negativeCount,
      satisfaction_rate: totalSamples > 0 && (positiveCount + negativeCount) > 0
        ? `${((positiveCount / (positiveCount + negativeCount)) * 100).toFixed(1)}%`
        : "100%",
    }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
