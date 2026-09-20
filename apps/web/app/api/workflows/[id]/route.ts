export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const workflow = await prisma.workflow.findFirst({
      where: { id, organizationId: user.orgId },
      include: {
        createdBy: { select: { name: true, email: true } },
      },
    });

    if (!workflow) {
      return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: workflow });
  } catch (err) {
    console.error("[workflows/:id GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.workflow.findFirst({
      where: { id, organizationId: user.orgId },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
    }

    const body = await req.json() as Partial<{
      name: string;
      description: string;
      status: string;
      nodes: unknown[];
      edges: unknown[];
    }>;

    const updated = await prisma.workflow.update({
      where: { id },
      data: {
        ...(body.name        && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status      && { status: body.status as never }),
        ...(body.nodes       && { nodes: body.nodes as never }),
        ...(body.edges       && { edges: body.edges as never }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[workflows/:id PATCH]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const existing = await prisma.workflow.findFirst({
      where: { id, organizationId: user.orgId },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
    }

    await prisma.workflow.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Workflow deleted" });
  } catch (err) {
    console.error("[workflows/:id DELETE]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
