/**
 * GET /api/ai/usage
 *
 * Returns aggregated usage statistics for the dashboard:
 *   AI Usage → Cost → Provider → Model → Tokens → Requests
 *
 * Response:
 *   {
 *     summary: UsageSummary[],       // per-provider aggregation
 *     recent:  UsageRecord[],        // last N requests
 *     totals:  { requests, tokens, cost }
 *   }
 */

import { NextResponse } from "next/server";
import { getUsageStore } from "@/lib/ai/usage";

export const runtime = "nodejs";

export async function GET() {
  const store = getUsageStore();
  const summary = store.getSummary();
  const recent = store.getRecent(50);

  const totals = summary.reduce(
    (acc, s) => ({
      requests: acc.requests + s.requests,
      promptTokens: acc.promptTokens + s.promptTokens,
      completionTokens: acc.completionTokens + s.completionTokens,
      totalTokens: acc.totalTokens + s.totalTokens,
      costUsd: acc.costUsd + s.costUsd,
      successCount: acc.successCount + s.successCount,
      failureCount: acc.failureCount + s.failureCount,
    }),
    {
      requests: 0,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      costUsd: 0,
      successCount: 0,
      failureCount: 0,
    },
  );

  return NextResponse.json({
    summary,
    recent,
    totals,
  });
}
