import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name?: string;
      email?: string;
      password?: string;
      orgName?: string;
    };

    const { name, email, password, orgName } = body;

    // ── Validate ────────────────────────────────────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "name, email and password are required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ── Check duplicate ──────────────────────────────────────────────────────
    const existing = await prisma.user.findUnique({ where: { email: emailLower } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // ── Create org + user in one transaction ─────────────────────────────────
    const passwordHash = await hashPassword(password);
    const orgSlug = (orgName ?? name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { user, org } = await prisma.$transaction(async (tx) => {
      // Create or reuse org by slug
      const org = await tx.organization.upsert({
        where: { slug: orgSlug },
        update: {},
        create: { name: orgName ?? `${name}'s Organization`, slug: orgSlug },
      });

      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: emailLower,
          passwordHash,
          role: "ADMIN",
          organizationId: org.id,
        },
      });

      return { user, org };
    });

    // ── Sign JWT & set cookie ─────────────────────────────────────────────────
    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      orgId: org.id,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          orgId: org.id,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
