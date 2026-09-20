export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const search = req.nextUrl.searchParams.get("q");

    const docs = await prisma.knowledgeDocument.findMany({
      where: search
        ? { title: { contains: search, mode: "insensitive" } }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: docs });
  } catch (err) {
    console.error("[knowledge GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json() as {
      title: string;
      mimeType?: string;
      sourceUrl?: string;
    };

    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, error: "title is required" }, { status: 400 });
    }

    const doc = await prisma.knowledgeDocument.create({
      data: {
        title:    body.title.trim(),
        mimeType: body.mimeType ?? "application/pdf",
        sourceUrl: body.sourceUrl ?? null,
        status:   "INDEXED",
      },
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (err) {
    console.error("[knowledge POST]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
