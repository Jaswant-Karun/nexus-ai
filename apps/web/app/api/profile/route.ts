import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/profile
 * Returns the current authenticated user's profile and org details.
 */
export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
          },
        },
        _count: {
          select: {
            conversations: true,
            agents: true,
            workflows: true,
            uploadedFiles: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error("[profile GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/profile
 * Updates the user's name, email, or avatarUrl.
 */
export async function PATCH(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      name?: string;
      email?: string;
      avatarUrl?: string;
    };

    const updateData: { name?: string; email?: string; avatarUrl?: string } = {};

    if (body.name?.trim()) updateData.name = body.name.trim();
    if (body.email?.trim()) updateData.email = body.email.trim().toLowerCase();
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;

    const updated = await prisma.user.update({
      where: { id: sessionUser.sub },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            plan: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[profile PATCH]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
