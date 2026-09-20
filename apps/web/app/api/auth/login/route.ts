import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // ── Look up user ──────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
      include: { organization: true },
    });

    // Timing-safe: always run bcrypt even on missing user to prevent enumeration
    const dummyHash = "$2b$12$invalidhashpadding000000000000000000000000000000000000000";
    const passwordMatch = await comparePassword(
      password,
      user?.passwordHash ?? dummyHash
    );

    if (!user || !user.passwordHash || !passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── Sign JWT & set cookie ─────────────────────────────────────────────────
    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      orgId: user.organizationId,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.organizationId,
        orgName: user.organization.name,
        orgPlan: user.organization.plan,
      },
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
