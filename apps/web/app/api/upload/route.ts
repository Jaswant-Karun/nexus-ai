import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { name?: string; size?: number; type?: string } | null;

  if (!body?.name) {
    return NextResponse.json({ success: false, error: "A file name is required." }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    file: {
      id: `upload_${Date.now()}`,
      name: body.name,
      size: body.size ?? 0,
      type: body.type ?? "application/octet-stream",
      status: "queued",
    },
  }, { status: 202 });
}