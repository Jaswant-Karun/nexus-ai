import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getMimeCategory } from "@/lib/storage";
import crypto from "node:crypto";
import path from "node:path";
import { writeFile, mkdir } from "node:fs/promises";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./uploads";
const MAX_SIZE   = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES ?? String(500 * 1024 * 1024));

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    const folderId = formData.get("folderId") as string | null;

    if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: `File exceeds maximum size of ${MAX_SIZE / 1e6} MB` }, { status: 413 });
    }

    const bytes    = await file.arrayBuffer();
    const buffer   = Buffer.from(bytes);
    const checksum = crypto.createHash("sha256").update(buffer).digest("hex");
    const ext      = path.extname(file.name);
    const storedName = `${checksum}${ext}`;
    const orgDir   = path.join(UPLOAD_DIR, user.orgId);

    await mkdir(orgDir, { recursive: true });
    await writeFile(path.join(orgDir, storedName), buffer);

    const storageUrl = `/uploads/${user.orgId}/${storedName}`;
    const category   = getMimeCategory(file.type);

    let folderPath = "/";
    if (folderId) {
      const folder = await prisma.storageFolder.findFirst({
        where: { id: folderId, organizationId: user.orgId },
      });
      if (folder) folderPath = folder.path;
    }

    const record = await prisma.storageFile.create({
      data: {
        name: file.name, originalName: file.name,
        mimeType: file.type || "application/octet-stream",
        category, sizeBytes: BigInt(file.size),
        storageUrl, checksum,
        folderId: folderId ?? null, folderPath,
        virusScanStatus: "PENDING",
        tags: [], aiKeywords: [],
        organizationId: user.orgId,
        uploadedById: user.sub,
      },
    });

    // Enqueue AI processing jobs (virus scan first, then extract/summarise if document)
    const jobs: { fileId: string; jobType: "VIRUS_SCAN"|"EXTRACT"|"SUMMARIZE"|"EMBED"|"THUMBNAIL"|"TRANSCRIBE"|"OCR"|"COMPRESS" }[] = [
      { fileId: record.id, jobType: "VIRUS_SCAN" },
      ...(["document", "spreadsheet", "presentation"].includes(category)
        ? [{ fileId: record.id, jobType: "EXTRACT" as const }, { fileId: record.id, jobType: "SUMMARIZE" as const }, { fileId: record.id, jobType: "EMBED" as const }]
        : []),
      ...(category === "image"  ? [{ fileId: record.id, jobType: "THUMBNAIL" as const }] : []),
      ...(category === "video"  ? [{ fileId: record.id, jobType: "THUMBNAIL" as const }, { fileId: record.id, jobType: "TRANSCRIBE" as const }] : []),
      ...(category === "audio"  ? [{ fileId: record.id, jobType: "TRANSCRIBE" as const }] : []),
    ];

    if (jobs.length) {
      await prisma.aiProcessingJob.createMany({ data: jobs });
    }

    if (["document", "spreadsheet", "presentation"].includes(category)) {
      await prisma.knowledgeDocument.create({
        data: {
          title: file.name,
          sourceUrl: storageUrl,
          mimeType: file.type || "application/octet-stream",
          status: "PENDING",
          sizeBytes: file.size,
          organizationId: user.orgId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { ...record, sizeBytes: Number(record.sizeBytes), category },
    }, { status: 201 });
  } catch (err) {
    console.error("[storage/upload POST]", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
