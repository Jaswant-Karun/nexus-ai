import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN" && user.role !== "SYSTEM") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const search = req.nextUrl.searchParams.get("search") ?? "";

    const users = await prisma.user.findMany({
      where: {
        organizationId: user.orgId,
        ...(search && {
          OR: [
            { name:  { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "asc" },
      select: {
        id:             true,
        name:           true,
        email:          true,
        role:           true,
        createdAt:      true,
        organization:   { select: { name: true, plan: true } },
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    console.error("[admin/users GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
