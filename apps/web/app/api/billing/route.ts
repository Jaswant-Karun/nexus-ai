import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const [org, fileStats, aiJobs, agentCount, conversationCount, docCount] = await Promise.all([
      prisma.organization.findUnique({
        where:  { id: user.orgId },
        select: { id: true, name: true, plan: true, slug: true },
      }),
      prisma.storageFile.aggregate({
        where: { organizationId: user.orgId, isTrashed: false },
        _count: true,
        _sum:   { sizeBytes: true },
      }),
      prisma.aiProcessingJob.count({ where: { status: "COMPLETED" } }),
      prisma.agent.count({  where: { organizationId: user.orgId } }),
      prisma.conversation.count({ where: { user: { organizationId: user.orgId } } }),
      prisma.knowledgeDocument.count(),
    ]);

    const usedStorageBytes = Number(fileStats._sum.sizeBytes ?? 0);
    const quotaBytes       = 1_073_741_824; // 1 GB — upgrade for larger

    return NextResponse.json({
      success: true,
      data: {
        plan:          org?.plan ?? "FREE",
        orgName:       org?.name ?? "",
        usedStorageBytes,
        quotaBytes,
        usedStorageGB: parseFloat((usedStorageBytes / 1e9).toFixed(3)),
        quotaGB:       parseFloat((quotaBytes / 1e9).toFixed(0)),
        storageFiles:  fileStats._count,
        aiJobsDone:    aiJobs,
        agentCount,
        conversationCount,
        docCount,
      },
    });
  } catch (err) {
    console.error("[billing GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
