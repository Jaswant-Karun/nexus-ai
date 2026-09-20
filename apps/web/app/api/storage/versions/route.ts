import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const fileId = req.nextUrl.searchParams.get("fileId");

    const versions = await prisma.fileVersion.findMany({
      where:   fileId ? { fileId } : { file: { organizationId: user.orgId } },
      orderBy: { versionNumber: "desc" },
      include: {
        file:      { select: { id: true, name: true, mimeType: true, organizationId: true } },
        createdBy: { select: { name: true } },
      },
    });

    // Only return versions belonging to this org
    const orgVersions = versions.filter((v) => v.file.organizationId === user.orgId);

    return NextResponse.json({
      success: true,
      data: orgVersions.map((v) => ({
        id:            v.id,
        fileId:        v.fileId,
        fileName:      v.file.name,
        mimeType:      v.file.mimeType,
        versionNumber: v.versionNumber,
        sizeBytes:     Number(v.sizeBytes),
        changeNote:    v.changeNote,
        createdBy:     v.createdBy.name,
        createdAt:     v.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[storage/versions GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
