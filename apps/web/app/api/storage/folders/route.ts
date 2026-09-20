import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const folders = await prisma.storageFolder.findMany({
      where: { organizationId: user.orgId, isDeleted: false },
      orderBy: { name: "asc" },
      include: { _count: { select: { files: true } } },
    });

    const mapped = folders.map((f) => ({
      id: f.id, name: f.name, parentId: f.parentId, path: f.path, color: f.color,
      fileCount: f._count.files, totalSize: 0,
      createdAt: f.createdAt.toISOString(), updatedAt: f.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (err) {
    console.error("[storage/folders GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { name, parentId, color } = await req.json() as {
      name: string; parentId?: string; color?: string;
    };

    if (!name?.trim()) return NextResponse.json({ success: false, error: "Folder name required" }, { status: 400 });

    let path = `/${name.trim()}`;
    if (parentId) {
      const parent = await prisma.storageFolder.findFirst({
        where: { id: parentId, organizationId: user.orgId },
      });
      if (parent) path = `${parent.path}/${name.trim()}`;
    }

    const folder = await prisma.storageFolder.create({
      data: {
        name: name.trim(), parentId: parentId ?? null,
        path, color, organizationId: user.orgId,
      },
    });

    return NextResponse.json({ success: true, data: folder }, { status: 201 });
  } catch (err) {
    console.error("[storage/folders POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json() as { id: string };

    await prisma.storageFolder.update({
      where: { id, organizationId: user.orgId },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[storage/folders DELETE]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
