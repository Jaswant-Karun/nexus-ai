import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Verify the conversation belongs to this user
    const conv = await prisma.conversation.findFirst({
      where: { id, userId: user.sub },
    });
    if (!conv) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const messages = await prisma.message.findMany({
      where:   { conversationId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (err) {
    console.error("[messages GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json() as { role?: string; content: string };

    if (!body.content?.trim()) {
      return NextResponse.json({ success: false, error: "content is required" }, { status: 400 });
    }

    // Verify ownership
    const conv = await prisma.conversation.findFirst({
      where: { id, userId: user.sub },
    });
    if (!conv) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Save the user message
    const message = await prisma.message.create({
      data: {
        conversationId: id,
        role:           body.role ?? "user",
        content:        body.content.trim(),
      },
    });

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id },
      data:  { lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (err) {
    console.error("[messages POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
