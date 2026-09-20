import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/dashboard/stats
 * Returns live counts for the dashboard KPI cards.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const orgId = user.orgId;

    const [
      activeAgents,
      totalAgents,
      workflows,
      conversations,
      messages,
      knowledgeDocs,
      storageFiles,
      storageSize,
      aiJobs,
      recentAgents,
    ] = await Promise.all([
      prisma.agent.count({ where: { organizationId: orgId, status: "ACTIVE" } }),
      prisma.agent.count({ where: { organizationId: orgId } }),
      prisma.workflow.count({ where: { organizationId: orgId } }),
      prisma.conversation.count({ where: { user: { organizationId: orgId } } }),
      prisma.message.count({ where: { conversation: { user: { organizationId: orgId } } } }),
      prisma.knowledgeDocument.count(),
      prisma.storageFile.count({ where: { organizationId: orgId, isTrashed: false } }),
      prisma.storageFile.aggregate({
        where:  { organizationId: orgId, isTrashed: false },
        _sum:   { sizeBytes: true },
      }),
      prisma.aiProcessingJob.count({ where: { status: "COMPLETED" } }),
      // Recent agents with conversation counts
      prisma.agent.findMany({
        where:   { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        take:    5,
        include: { _count: { select: { conversations: true } } },
      }),
    ]);

    const totalSizeGB = Number(storageSize._sum.sizeBytes ?? 0) / 1e9;

    return NextResponse.json({
      success: true,
      data: {
        activeAgents,
        totalAgents,
        activeWorkflows:  workflows,
        totalConversations: conversations,
        totalMessages:    messages,
        knowledgeDocs,
        storageFiles,
        storageSizeGB:    parseFloat(totalSizeGB.toFixed(2)),
        aiJobsDone:       aiJobs,
        recentAgents:     recentAgents.map((a) => ({
          id:            a.id,
          name:          a.name,
          status:        a.status,
          model:         (a.config as { model?: string }).model ?? "unknown",
          conversations: a._count.conversations,
          createdAt:     a.createdAt,
        })),
      },
    });
  } catch (err) {
    console.error("[dashboard/stats]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
