export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/**
 * Reports are not yet a Prisma model — returns seeded data for the
 * authenticated user. Replace with prisma.report.findMany(...) once
 * the Report model is added to the schema.
 */

interface ReportSummary {
  id: string;
  title: string;
  type: string;
  author: string;
  date: string;
  status: string;
  summary: string;
}

const SEED_REPORTS: ReportSummary[] = [
  {
    id: 'rep-cluster-perf-aug',
    title: 'Enterprise Cluster Performance & SLA Audit (August 2026)',
    type: 'Infrastructure & SLA',
    author: 'Nexus Telemetry Engine',
    date: 'Sep 1, 2026',
    status: 'Published',
    summary: '99.98% cluster availability, 312ms average latency, and zero data breaches recorded across 4 active microservices.',
  },
  {
    id: 'rep-food-delivery-spec',
    title: 'Food Delivery Multi-Agent Architecture Specification',
    type: 'System Architecture',
    author: 'Jaswant Karun & Orchestrator',
    date: 'Sep 5, 2026',
    status: 'Verified',
    summary: 'Complete technical breakdown of asynchronous event queues, driver geo-dispatch, and consensus verification.',
  },
  {
    id: 'rep-token-spend-q3',
    title: 'Q3 Enterprise Token Spend & Cost Attribution',
    type: 'Financial & Billing',
    author: 'Billing Service',
    date: 'Sep 3, 2026',
    status: 'Published',
    summary: 'Detailed model spend across GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro with cost optimization suggestions.',
  },
];

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: SEED_REPORTS });
  } catch (err) {
    console.error("[reports GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as Partial<ReportSummary>;

    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, error: "title is required" }, { status: 400 });
    }

    const report: ReportSummary = {
      id: `rep-${Date.now()}`,
      title: body.title.trim(),
      type: body.type ?? 'General',
      author: user.email,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Draft',
      summary: body.summary?.trim() ?? '',
    };

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (err) {
    console.error("[reports POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
