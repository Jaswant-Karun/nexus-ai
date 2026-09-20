import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const [users, orgs, agents, workflows, files, aiJobs, messages, docs] = await Promise.all([
      prisma.user.count(),
      prisma.organization.count(),
      prisma.agent.count({    where: { organizationId: user.orgId } }),
      prisma.workflow.count({ where: { organizationId: user.orgId } }),
      prisma.storageFile.count({ where: { organizationId: user.orgId, isTrashed: false } }),
      prisma.aiProcessingJob.count({ where: { status: "COMPLETED" } }),
      prisma.message.count(),
      prisma.knowledgeDocument.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers:        users,
        totalOrgs:         orgs,
        totalAgents:       agents,
        totalWorkflows:    workflows,
        totalFiles:        files,
        totalAiJobs:       aiJobs,
        totalMessages:     messages,
        totalDocs:         docs,
      },
    });
  } catch (err) {
    console.error("[admin/summary GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
