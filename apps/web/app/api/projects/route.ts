export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/**
 * Projects are not yet a Prisma model — this route returns seeded mock data
 * scoped to the authenticated user. When a Project model is added to the
 * schema, replace the mock list with prisma.project.findMany(...).
 */

interface Project {
  id: string;
  name: string;
  desc: string;
  status: string;
  progress: number;
  tasksCount: number;
  members: string[];
  updated: string;
  startDate: string;
  dueDate: string;
}

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-food-delivery',
    name: 'Food Delivery Platform Architecture',
    desc: 'Autonomous multi-agent system specification, real-time dispatch, and PostgreSQL pgvector schema.',
    status: 'In Progress',
    progress: 75,
    tasksCount: 24,
    members: ['Jaswant Karun', 'Agent 3 Critic', 'Orchestrator'],
    updated: '20 minutes ago',
    startDate: 'Aug 20, 2026',
    dueDate: 'Sep 20, 2026',
  },
  {
    id: 'proj-enterprise-rag',
    name: 'Enterprise Hybrid RAG Knowledge Engine',
    desc: 'Integration between pgvector, Neo4j knowledge graphs, and semantic embeddings for corporate document search.',
    status: 'Active',
    progress: 90,
    tasksCount: 18,
    members: ['Jaswant Karun', 'Research Agent'],
    updated: '2 hours ago',
    startDate: 'Aug 1, 2026',
    dueDate: 'Sep 15, 2026',
  },
  {
    id: 'proj-agent-marketplace',
    name: 'Autonomous Agent Marketplace & Sandbox',
    desc: 'Public and private agent persona directory with gVisor container isolation and micro-billing.',
    status: 'Planning',
    progress: 35,
    tasksCount: 42,
    members: ['Jaswant Karun', 'Full-Stack Synthesizer'],
    updated: 'Yesterday',
    startDate: 'Sep 1, 2026',
    dueDate: 'Oct 15, 2026',
  },
];

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: SEED_PROJECTS });
  } catch (err) {
    console.error("[projects GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as Partial<Project>;

    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "name is required" }, { status: 400 });
    }

    // In-memory creation — returns the object as if persisted
    const project: Project = {
      id: `proj-${Date.now()}`,
      name: body.name.trim(),
      desc: body.desc?.trim() ?? '',
      status: body.status ?? 'Planning',
      progress: body.progress ?? 0,
      tasksCount: body.tasksCount ?? 0,
      members: body.members ?? [user.email],
      updated: 'Just now',
      startDate: body.startDate ?? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: body.dueDate ?? '—',
    };

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (err) {
    console.error("[projects POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
