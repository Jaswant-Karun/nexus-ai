import "dotenv/config";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/nexus_ai";
const uploadRoot = process.env.UPLOAD_DIR ?? path.resolve(process.cwd(), "uploads");
const chunkSize = 900;
const chunkOverlap = 120;
const textExtensions = new Set([".txt", ".md", ".markdown", ".csv", ".json", ".html", ".htm", ".xml", ".ts", ".tsx", ".js", ".jsx", ".py"]);

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function chunkCount(text: string): number {
  if (!text.trim()) return 0;
  return Math.ceil(text.length / (chunkSize - chunkOverlap));
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
    if (!textExtensions.has(extension) && !job.file.mimeType.startsWith("text/")) {
      throw new Error(`Text extraction is not implemented for ${job.file.mimeType}`);
    }

    const filePath = path.join(uploadRoot, job.file.organizationId, path.basename(job.file.storageUrl));
    const text = (await readFile(filePath, "utf8")).replace(/\s+/g, " ").trim();
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

async function main(): Promise<void> {
  const jobs = await prisma.aiProcessingJob.findMany({
    where: { jobType: "EXTRACT", status: "PENDING" },
    include: { file: { select: { id: true, name: true, mimeType: true, storageUrl: true, organizationId: true } } },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  for (const job of jobs) await processExtractJob(job);
  console.log(`Processed ${jobs.length} extraction job(s)`);
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