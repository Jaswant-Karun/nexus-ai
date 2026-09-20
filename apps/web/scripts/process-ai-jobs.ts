import "dotenv/config";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/nexus_ai";
const uploadRoot = process.env.UPLOAD_DIR ?? path.resolve(process.cwd(), "uploads");
const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8001";
const chunkSize = 900;
const chunkOverlap = 120;
const textExtensions = new Set([".txt", ".md", ".markdown", ".csv", ".json", ".html", ".htm", ".xml", ".ts", ".tsx", ".js", ".jsx", ".py"]);
const pdfMimeType = "application/pdf";
const docxMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function chunkCount(text: string): number {
  if (!text.trim()) return 0;
  return Math.ceil(text.length / (chunkSize - chunkOverlap));
}

async function extractText(filePath: string, name: string, mimeType: string): Promise<string> {
  const buffer = await readFile(filePath);
  const extension = path.extname(name).toLowerCase();

  if (mimeType === pdfMimeType || extension === ".pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      return (await parser.getText()).text;
    } finally {
      await parser.destroy();
    }
  }

  if (mimeType === docxMimeType || extension === ".docx") {
    return (await mammoth.extractRawText({ buffer })).value;
  }

  return buffer.toString("utf8");
}

async function processExtractJob(job: {
  id: string;
  file: { id: string; name: string; mimeType: string; storageUrl: string; organizationId: string };
}): Promise<void> {
  const claimed = await prisma.aiProcessingJob.updateMany({
    where: { id: job.id, status: "PENDING" },
    data: { status: "PROCESSING", startedAt: new Date(), progress: 10 },
  });
  if (claimed.count === 0) return;

  try {
    const extension = path.extname(job.file.name).toLowerCase();
    const supportedBinary = job.file.mimeType === pdfMimeType || job.file.mimeType === docxMimeType || extension === ".pdf" || extension === ".docx";
    if (!textExtensions.has(extension) && !job.file.mimeType.startsWith("text/") && !supportedBinary) {
      throw new Error(`Text extraction is not implemented for ${job.file.mimeType}`);
    }

    const filePath = path.join(uploadRoot, job.file.organizationId, path.basename(job.file.storageUrl));
    const text = (await extractText(filePath, job.file.name, job.file.mimeType)).replace(/\s+/g, " ").trim();
    const chunks = chunkCount(text);

    await prisma.storageFile.update({
      where: { id: job.file.id },
      data: { aiExtractedText: text },
    });
    await prisma.knowledgeDocument.updateMany({
      where: { sourceUrl: job.file.storageUrl, organizationId: job.file.organizationId },
      data: { status: "INDEXED", chunkCount: chunks, sizeBytes: Buffer.byteLength(text, "utf8") },
    });
    await prisma.aiProcessingJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        progress: 100,
        completedAt: new Date(),
        result: { characters: text.length, chunks },
      },
    });
    console.log(`Indexed ${job.file.name}: ${chunks} chunks`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.aiProcessingJob.update({
      where: { id: job.id },
      data: { status: "FAILED", progress: 0, completedAt: new Date(), errorMessage: message },
    });
    await prisma.knowledgeDocument.updateMany({
      where: { sourceUrl: job.file.storageUrl, organizationId: job.file.organizationId },
      data: { status: "FAILED" },
    });
    console.error(`Failed to index ${job.file.name}: ${message}`);
  }
}

async function processEmbedJob(job: {
  id: string;
  file: { id: string; name: string; storageUrl: string; organizationId: string; aiExtractedText: string | null };
}): Promise<void> {
  const claimed = await prisma.aiProcessingJob.updateMany({
    where: { id: job.id, status: "PENDING" },
    data: { status: "PROCESSING", startedAt: new Date(), progress: 10 },
  });
  if (claimed.count === 0) return;

  try {
    if (!job.file.aiExtractedText?.trim()) {
      throw new Error("No extracted text is available for embedding");
    }

    const text = job.file.aiExtractedText.trim();
    const documents = Array.from(
      { length: chunkCount(text) },
      (_, index) => text.slice(index * (chunkSize - chunkOverlap), index * (chunkSize - chunkOverlap) + chunkSize),
    );
    const response = await fetch(`${aiServiceUrl}/v1/vector-search/index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collection: `nexus_docs_${job.file.organizationId}`,
        documents,
        ids: documents.map((_, index) => `${job.file.id}_${index}`),
        metadata: documents.map((_, index) => ({
          organizationId: job.file.organizationId,
          fileId: job.file.id,
          source: job.file.storageUrl,
          chunkIndex: index,
        })),
      }),
    });
    if (!response.ok) throw new Error(`Embedding service returned HTTP ${response.status}`);

    const result = await response.json() as { indexed?: number; failed?: number };
    if ((result.failed ?? 0) > 0 || (result.indexed ?? 0) !== documents.length) {
      throw new Error(`Embedding service indexed ${result.indexed ?? 0}/${documents.length} chunks`);
    }

    await prisma.aiProcessingJob.update({
      where: { id: job.id },
      data: { status: "COMPLETED", progress: 100, completedAt: new Date(), result: { indexed: documents.length } },
    });
    console.log(`Embedded ${job.file.name}: ${documents.length} chunks`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.aiProcessingJob.update({
      where: { id: job.id },
      data: { status: "FAILED", progress: 0, completedAt: new Date(), errorMessage: message },
    });
    console.error(`Failed to embed ${job.file.name}: ${message}`);
  }
}

async function main(): Promise<void> {
  const jobs = await prisma.aiProcessingJob.findMany({
    where: { jobType: "EXTRACT", status: "PENDING" },
    include: { file: { select: { id: true, name: true, mimeType: true, storageUrl: true, organizationId: true } } },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const embedJobs = await prisma.aiProcessingJob.findMany({
    where: { jobType: "EMBED", status: "PENDING" },
    include: { file: { select: { id: true, name: true, storageUrl: true, organizationId: true, aiExtractedText: true } } },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  for (const job of jobs) await processExtractJob(job);
  for (const job of embedJobs) await processEmbedJob(job);
  console.log(`Processed ${jobs.length} extraction and ${embedJobs.length} embedding job(s)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });