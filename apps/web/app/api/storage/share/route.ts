import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const fileId = req.nextUrl.searchParams.get("fileId");
    const where  = {
      createdById: user.sub,
      isRevoked: false,
      ...(fileId && { fileId }),
    };

    const shares = await prisma.fileShare.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { file: { select: { name: true } } },
    });

    const mapped = shares.map((s) => ({
      id: s.id, fileId: s.fileId, fileName: s.file.name,
      token: s.token,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/share/${s.token}`,
      permission: s.permission.toLowerCase(),
      isPublic: s.isPublic,
      expiresAt: s.expiresAt?.toISOString(),
      downloadLimit: s.downloadLimit,
      downloadCount: s.downloadCount,
      createdById: s.createdById,
      createdAt: s.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (err) {
    console.error("[storage/share GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { fileId, permission, isPublic, password, expiresAt, downloadLimit } =
      await req.json() as {
        fileId: string;
        permission?: string;
        isPublic?: boolean;
        password?: string;
        expiresAt?: string;
        downloadLimit?: number;
      };

    if (!fileId) return NextResponse.json({ success: false, error: "fileId required" }, { status: 400 });

    const file = await prisma.storageFile.findFirst({
      where: { id: fileId, organizationId: user.orgId, isTrashed: false },
    });
    if (!file) return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });

    const token        = crypto.randomBytes(24).toString("hex");
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const share = await prisma.fileShare.create({
      data: {
        fileId, token,
        permission: ((permission ?? "view").toUpperCase()) as "VIEW" | "DOWNLOAD" | "EDIT",
        isPublic: isPublic ?? false,
        passwordHash,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        downloadLimit: downloadLimit ?? null,
        createdById: user.sub,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...share,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/share/${share.token}`,
        createdAt: share.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (err) {
    console.error("[storage/share POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json() as { id: string };
    await prisma.fileShare.update({
      where: { id, createdById: user.sub },
      data: { isRevoked: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[storage/share DELETE]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
