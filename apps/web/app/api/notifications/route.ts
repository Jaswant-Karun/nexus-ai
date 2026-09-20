import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface DbNotif {
  id: string;
  kind: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

/** Notifications live in a JSON column on the User record for now.
 *  We generate them from real DB activity (agents, workflows, storage files, access logs). */
async function getNotificationsFromActivity(orgId: string, userId: string): Promise<DbNotif[]> {
  const notifs: DbNotif[] = [];

  const [agents, workflows, files, logs] = await Promise.all([
    prisma.agent.findMany({
      where:   { organizationId: orgId },
      orderBy: { updatedAt: "desc" },
      take:    3,
      select:  { id: true, name: true, status: true, updatedAt: true },
    }),
    prisma.workflow.findMany({
      where:   { organizationId: orgId },
      orderBy: { updatedAt: "desc" },
      take:    3,
      select:  { id: true, name: true, status: true, updatedAt: true },
    }),
    prisma.storageFile.findMany({
      where:   { organizationId: orgId, isTrashed: false },
      orderBy: { createdAt: "desc" },
      take:    3,
      select:  { id: true, name: true, virusScanStatus: true, sizeBytes: true, createdAt: true },
    }),
    prisma.accessLog.findMany({
      where:   { file: { organizationId: orgId } },
      orderBy: { createdAt: "desc" },
      take:    3,
      include: { file: { select: { name: true } } },
    }),
  ]);

  agents.forEach((a) => {
    notifs.push({
      id:        `agent-${a.id}`,
      kind:      "agent",
      title:     a.status === "ACTIVE" ? "Agent active" : "Agent paused",
      body:      `${a.name} is currently ${a.status.toLowerCase()}.`,
      read:      true,
      createdAt: a.updatedAt,
    });
  });

  workflows.forEach((w) => {
    notifs.push({
      id:        `wf-${w.id}`,
      kind:      "workflow",
      title:     `Workflow: ${w.name}`,
      body:      `Status: ${w.status.toLowerCase()}.`,
      read:      true,
      createdAt: w.updatedAt,
    });
  });

  files.forEach((f) => {
    const clean = f.virusScanStatus === "CLEAN";
    notifs.push({
      id:        `file-${f.id}`,
      kind:      "system",
      title:     clean ? "File uploaded & scanned" : "File scan pending",
      body:      `${f.name} (${(Number(f.sizeBytes) / 1e6).toFixed(1)} MB) — ${clean ? "clean" : f.virusScanStatus.toLowerCase()}.`,
      read:      true,
      createdAt: f.createdAt,
    });
  });

  logs.forEach((l) => {
    notifs.push({
      id:        `log-${l.id}`,
      kind:      "system",
      title:     `File ${l.action}`,
      body:      `"${l.file.name}" was ${l.action}d.`,
      read:      false,
      createdAt: l.createdAt,
    });
  });

  // Sort newest first
  notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return notifs.slice(0, 20);
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const notifs = await getNotificationsFromActivity(user.orgId, user.sub);
    return NextResponse.json({ success: true, data: notifs });
  } catch (err) {
    console.error("[notifications GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { action } = await req.json() as { action: "read-all" };
    // In a real system this would update a notifications table
    return NextResponse.json({ success: true, action });
  } catch (err) {
    console.error("[notifications PATCH]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
