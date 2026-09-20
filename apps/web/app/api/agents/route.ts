export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const agents = await prisma.agent.findMany({
      where:   { organizationId: user.orgId },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { name: true, email: true } },
        _count:    { select: { conversations: true } },
      },
    });

    return NextResponse.json({ success: true, data: agents });
  } catch (err) {
    console.error("[agents GET]", err);
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
      config: Record<string, unknown>;
    };

    if (!body.name?.trim() || !body.description?.trim()) {
      return NextResponse.json({ success: false, error: "name and description are required" }, { status: 400 });
    }

    const agent = await prisma.agent.create({
      data: {
        name:           body.name.trim(),
        description:    body.description.trim(),
        status:         "ACTIVE",
        config:         (body.config ?? {}) as never,
        organizationId: user.orgId,
        createdById:    user.sub,
      },
    });

    return NextResponse.json({ success: true, data: agent }, { status: 201 });
  } catch (err) {
    console.error("[agents POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
