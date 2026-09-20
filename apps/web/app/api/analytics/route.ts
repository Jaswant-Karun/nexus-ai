import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const [
      agentCount, workflowCount, conversationCount, messageCount,
      fileCount, storageSize, aiJobCount, docCount,
      recentAgents, recentWorkflows,
    ] = await Promise.all([
      prisma.agent.count({      where: { organizationId: user.orgId } }),
      prisma.workflow.count({   where: { organizationId: user.orgId } }),
      prisma.conversation.count({ where: { user: { organizationId: user.orgId } } }),
      prisma.message.count({    where: { conversation: { user: { organizationId: user.orgId } } } }),
      prisma.storageFile.count({ where: { organizationId: user.orgId, isTrashed: false } }),
      prisma.storageFile.aggregate({
        where: { organizationId: user.orgId, isTrashed: false },
        _sum:  { sizeBytes: true },
      }),
      prisma.aiProcessingJob.count({ where: { status: "COMPLETED" } }),
      prisma.knowledgeDocument.count(),
      prisma.agent.findMany({
        where:   { organizationId: user.orgId },
        take:    5,
        orderBy: { createdAt: "desc" },
        select:  { id: true, name: true, status: true },
      }),
      prisma.workflow.findMany({
        where:   { organizationId: user.orgId },
        take:    5,
        orderBy: { updatedAt: "desc" },
        select:  { id: true, name: true, status: true, updatedAt: true },
      }),
    ]);

    const totalSizeGB = Number(storageSize._sum.sizeBytes ?? 0) / 1e9;

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          agents:        agentCount,
          workflows:     workflowCount,
          conversations: conversationCount,
          messages:      messageCount,
          storageFiles:  fileCount,
          storageSizeGB: parseFloat(totalSizeGB.toFixed(2)),
          aiJobs:        aiJobCount,
          knowledgeDocs: docCount,
        },
        recentAgents:    recentAgents,
        recentWorkflows: recentWorkflows.map((w) => ({
          id:        w.id,
          name:      w.name,
          status:    w.status,
          updatedAt: w.updatedAt,
        })),
      },
    });
  } catch (err) {
    console.error("[analytics GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
