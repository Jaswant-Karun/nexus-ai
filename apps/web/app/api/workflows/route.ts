export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const workflows = await prisma.workflow.findMany({
      where:   { organizationId: user.orgId },
      orderBy: { updatedAt: "desc" },
      include: {
        createdBy: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, data: workflows });
  } catch (err) {
    console.error("[workflows GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json() as {
      name: string;
      description: string;
      nodes?: unknown[];
      edges?: unknown[];
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "name is required" }, { status: 400 });
    }

    const workflow = await prisma.workflow.create({
      data: {
        name:           body.name.trim(),
        description:    body.description?.trim() ?? "",
        status:         "DRAFT",
        nodes:          (body.nodes ?? []) as never,
        edges:          (body.edges ?? []) as never,
        organizationId: user.orgId,
        createdById:    user.sub,
      },
    });

    return NextResponse.json({ success: true, data: workflow }, { status: 201 });
  } catch (err) {
    console.error("[workflows POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
