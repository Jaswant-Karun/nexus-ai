import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const conversations = await prisma.conversation.findMany({
      where:   { userId: user.sub },
      orderBy: { lastMessageAt: "desc" },
      include: {
        agent:    { select: { id: true, name: true, avatar: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { role: true, content: true, createdAt: true },
        },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({ success: true, data: conversations });
  } catch (err) {
    console.error("[conversations GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json() as { agentId?: string; title?: string };

    const conversation = await prisma.conversation.create({
      data: {
        title:   body.title ?? "New Conversation",
        agentId: body.agentId ?? null,
        userId:  user.sub,
      },
    });

    return NextResponse.json({ success: true, data: conversation }, { status: 201 });
  } catch (err) {
    console.error("[conversations POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
