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

    const agent = await prisma.agent.findFirst({
      where: { id, organizationId: user.orgId },
      include: {
        createdBy: { select: { name: true, email: true } },
        _count: { select: { conversations: true } },
      },
    });

    if (!agent) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: agent });
  } catch (err) {
    console.error("[agents/:id GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const existing = await prisma.agent.findFirst({
      where: { id, organizationId: user.orgId },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    const body = await req.json() as Partial<{
      name: string;
      description: string;
      status: string;
      config: Record<string, unknown>;
      avatar: string;
    }>;

    const updated = await prisma.agent.update({
      where: { id },
      data: {
        ...(body.name        && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status      && { status: body.status as never }),
        ...(body.config      && { config: body.config as never }),
        ...(body.avatar      !== undefined && { avatar: body.avatar }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[agents/:id PATCH]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const existing = await prisma.agent.findFirst({
      where: { id, organizationId: user.orgId },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    await prisma.agent.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Agent deleted" });
  } catch (err) {
    console.error("[agents/:id DELETE]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
