import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const folderId  = searchParams.get("folderId") ?? undefined;
    const search    = searchParams.get("q") ?? undefined;
    const trashed   = searchParams.get("trashed") === "true";
    const starred   = searchParams.get("starred") === "true";
    const category  = searchParams.get("category") ?? undefined;
    const page      = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize  = Math.min(100, parseInt(searchParams.get("pageSize") ?? "50"));

    const where = {
      organizationId: user.orgId,
      isTrashed: trashed,
      ...(starred              && { isStarred: true }),
      ...(folderId !== undefined && !trashed && !starred && { folderId: folderId || null }),
      ...(category             && { category }),
      ...(search               && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [files, total] = await Promise.all([
      prisma.storageFile.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true, name: true, originalName: true, mimeType: true, category: true,
          sizeBytes: true, storageUrl: true, thumbnailUrl: true,
          folderId: true, folderPath: true, isStarred: true, isTrashed: true, trashedAt: true,
          checksum: true, virusScanStatus: true, downloadCount: true, tags: true,
          aiSummary: true, aiKeywords: true, organizationId: true, uploadedById: true,
          createdAt: true, updatedAt: true,
          _count: { select: { versions: true } },
        },
      }),
      prisma.storageFile.count({ where }),
    ]);

    const mapped = files.map((f) => ({
      ...f,
      sizeBytes: Number(f.sizeBytes),
      versionCount: f._count.versions,
      virusScanStatus: f.virusScanStatus.toLowerCase(),
      orgId: f.organizationId,
      uploadedById: f.uploadedById,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
      trashedAt: f.trashedAt?.toISOString() ?? undefined,
    }));

    return NextResponse.json({ success: true, data: mapped, total, page, pageSize });
  } catch (err) {
    console.error("[storage/files GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { ids, permanent } = await req.json() as { ids: string[]; permanent?: boolean };
    if (!ids?.length) return NextResponse.json({ success: false, error: "No file IDs provided" }, { status: 400 });

    if (permanent) {
      await prisma.storageFile.deleteMany({
        where: { id: { in: ids }, organizationId: user.orgId, isTrashed: true },
      });
    } else {
      await prisma.storageFile.updateMany({
        where: { id: { in: ids }, organizationId: user.orgId },
        data: { isTrashed: true, trashedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[storage/files DELETE]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id, action, ...data } = await req.json() as {
      id: string;
      action: "star" | "unstar" | "restore" | "rename" | "move" | "tag";
      [key: string]: unknown;
    };

    const baseWhere = { id, organizationId: user.orgId };

    let update: Record<string, unknown> = {};
    if (action === "star")    update = { isStarred: true };
    if (action === "unstar")  update = { isStarred: false };
    if (action === "restore") update = { isTrashed: false, trashedAt: null };
    if (action === "rename")  update = { name: data.name };
    if (action === "move")    update = { folderId: data.folderId ?? null, folderPath: data.folderPath ?? "/" };
    if (action === "tag")     update = { tags: data.tags };

    const file = await prisma.storageFile.update({ where: baseWhere, data: update });

    return NextResponse.json({ success: true, data: { ...file, sizeBytes: Number(file.sizeBytes) } });
  } catch (err) {
    console.error("[storage/files PATCH]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
