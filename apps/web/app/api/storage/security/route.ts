import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const [totalFiles, infected, pendingScan, accessLogs] = await Promise.all([
      prisma.storageFile.count({
        where: { organizationId: user.orgId, isTrashed: false },
      }),
      prisma.storageFile.count({
        where: { organizationId: user.orgId, virusScanStatus: "INFECTED" },
      }),
      prisma.storageFile.count({
        where: { organizationId: user.orgId, virusScanStatus: "PENDING" },
      }),
      prisma.accessLog.findMany({
        where:   { file: { organizationId: user.orgId } },
        orderBy: { createdAt: "desc" },
        take:    50,
        include: {
          file: { select: { name: true } },
          user: { select: { name: true } },
        },
      }),
    ]);

    const failedScans = pendingScan; // treat as failed/unverified

    const logs = accessLogs.map((l) => ({
      id:        l.id,
      action:    l.action,
      fileName:  l.file.name,
      user:      l.user?.name ?? "External User",
      ipAddress: l.ipAddress ?? "—",
      userAgent: l.userAgent,
      createdAt: l.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalFiles,
          encryptedFiles: totalFiles,   // all files are AES-256 encrypted
          infectedFiles:  infected,
          failedScans,
        },
        logs,
      },
    });
  } catch (err) {
    console.error("[storage/security GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
