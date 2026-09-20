/**
 * NEXUS AI — Production PostgreSQL Seed Script
 * Run: pnpm db:seed
 */

import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

// Load .env.local first, then fall back to root .env
const envLocal = path.resolve(__dirname, "../.env.local");
const envRoot = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else if (fs.existsSync(envRoot)) {
  dotenv.config({ path: envRoot });
} else {
  dotenv.config();
}

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

/* ─── DB client ──────────────────────────────────────────────────────────── */
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nexus_ai",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const hash = (p: string) => bcrypt.hash(p, 12);
const token = () => crypto.randomBytes(24).toString("hex");

async function main() {
  console.log("🌱  Starting NEXUS AI Production Seed…\n");

  /* ── 1. Wipe existing data ─────────────────────────────────────────────── */
  console.log("🗑   Purging legacy dummy records…");
  await prisma.accessLog.deleteMany();
  await prisma.aiProcessingJob.deleteMany();
  await prisma.fileShare.deleteMany();
  await prisma.fileVersion.deleteMany();
  await prisma.storageFile.deleteMany();
  await prisma.storageFolder.deleteMany();
  await prisma.knowledgeDocument.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  console.log("   ✓ Clean slate ready\n");

  /* ── 2. Organization ──────────────────────────────────────────────────── */
  console.log("🏢  Creating primary organization…");
  const org = await prisma.organization.create({
    data: {
      name: "Nexus AI Global Labs",
      slug: "nexus-ai-labs",
      plan: "ENTERPRISE",
    },
  });
  console.log(`   ✓ ${org.name} (${org.id})\n`);

  /* ── 3. Users ─────────────────────────────────────────────────────────── */
  console.log("👤  Creating authentic administrator & team accounts…");
  const adminHash = await hash("Admin@nexus123!");
  const memberHash = await hash("Member@nexus123!");

  const admin = await prisma.user.create({
    data: {
      name: "Jaswant Karun",
      email: "admin@nexus.ai",
      passwordHash: adminHash,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      role: "ADMIN",
      organizationId: org.id,
    },
  });

  const member = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "member@nexus.ai",
      passwordHash: memberHash,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      role: "MEMBER",
      organizationId: org.id,
    },
  });

  console.log(`   ✓ ${admin.name}  <${admin.email}>  [ADMIN]`);
  console.log(`   ✓ ${member.name} <${member.email}> [MEMBER]\n`);

  /* ── 4. Agents with active configured models ───────────────────────────── */
  console.log("🤖  Deploying specialized AI agents…");
  const agentDefs = [
    {
      name: "Nexus Data & Intelligence Analyst",
      description: "Performs real-time metric analysis, extracts business patterns, and suggests optimal growth strategies using GPT-4o.",
      avatar: "📊",
      config: {
        model: "gpt-4o",
        provider: "openai",
        temperature: 0.2,
        maxTokens: 8192,
        systemPrompt: "You are the NEXUS Data Analyst. Analyze metrics, compute statistical trends, and provide high-impact, data-grounded insights.",
        tools: ["code_interpreter", "search", "file_read"],
      },
    },
    {
      name: "Customer & Partner Support Agent",
      description: "Provides nuanced, context-aware support and platform onboarding assistance powered by Claude 3.5 Sonnet.",
      avatar: "🤝",
      config: {
        model: "claude-3-5-sonnet",
        provider: "anthropic",
        temperature: 0.4,
        maxTokens: 4096,
        systemPrompt: "You are the NEXUS AI Support Agent. Assist users with questions regarding the platform, architecture, and agent capabilities accurately and warmly.",
        tools: ["knowledge_search", "ticket_create"],
      },
    },
    {
      name: "Code Architect & Security Auditor",
      description: "Analyzes system architecture, reviews TypeScript/Python pull requests, and highlights security and performance bottlenecks.",
      avatar: "🛡️",
      config: {
        model: "gpt-4o",
        provider: "openai",
        temperature: 0.1,
        maxTokens: 16384,
        systemPrompt: "You are a principal software architect. Review code meticulously for type safety, security flaws, algorithmic efficiency, and adherence to clean design patterns.",
        tools: ["code_interpreter", "search"],
      },
    },
    {
      name: "RAG Document Synthesizer",
      description: "Queries indexed enterprise documents and knowledge bases using sub-second Gemini 2.5 Flash semantic search.",
      avatar: "⚡",
      config: {
        model: "gemini-2.5-flash",
        provider: "google",
        temperature: 0.2,
        maxTokens: 8192,
        systemPrompt: "You are the NEXUS Document Synthesizer. Synthesize answers directly from indexed documents. Always cite key sources and sections inline.",
        tools: ["vector_search", "knowledge_search", "file_read"],
      },
    },
    {
      name: "Autonomous Workflow Orchestrator",
      description: "Coordinates multi-agent pipelines, delegates complex tasks across LLMs, and handles automated retries.",
      avatar: "⚙️",
      config: {
        model: "gpt-4o",
        provider: "openai",
        temperature: 0.0,
        maxTokens: 8192,
        systemPrompt: "You are the NEXUS Workflow Orchestrator. Decompose complex user goals into atomic tasks, dispatch to specialist agents, and consolidate the output.",
        tools: ["agent_call", "code_interpreter", "search"],
      },
    },
  ];

  const agents = [];
  for (const def of agentDefs) {
    const agent = await prisma.agent.create({
      data: {
        name: def.name,
        description: def.description,
        avatar: def.avatar,
        status: "ACTIVE",
        config: def.config,
        organizationId: org.id,
        createdById: admin.id,
      },
    });
    agents.push(agent);
    console.log(`   ✓ ${agent.name} (${def.config.model})`);
  }
  console.log();

  /* ── 5. Real Workflows ─────────────────────────────────────────────────── */
  console.log("⚡  Configuring production workflows…");
  const workflowDefs = [
    {
      name: "Document Intelligence & OCR Pipeline",
      description: "Ingests uploaded documents, verifies integrity, extracts text, summarizes content, and indexes vector embeddings into PostgreSQL.",
      status: "ACTIVE" as const,
      nodes: [
        { id: "n1", kind: "trigger", label: "File Ingested", config: { event: "storage.file.created" }, position: { x: 0, y: 0 } },
        { id: "n2", kind: "action", label: "Integrity & Virus Check", config: { service: "internal_scanner" }, position: { x: 1, y: 0 } },
        { id: "n3", kind: "agent", label: "Text Extraction & OCR", config: { agentId: agents[3].id }, position: { x: 2, y: 0 } },
        { id: "n4", kind: "agent", label: "AI Executive Summary", config: { agentId: agents[0].id }, position: { x: 3, y: 0 } },
        { id: "n5", kind: "output", label: "Commit to Knowledge Graph", config: {}, position: { x: 4, y: 0 } },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
        { id: "e4", source: "n4", target: "n5" },
      ],
    },
    {
      name: "Multi-Model Query Router & Fallback Pipeline",
      description: "Dynamically classifies incoming questions by complexity and dispatches to Gemini Flash, Claude Sonnet, or GPT-4o.",
      status: "ACTIVE" as const,
      nodes: [
        { id: "n1", kind: "trigger", label: "Incoming User Prompt", config: { event: "chat.message.received" }, position: { x: 0, y: 0 } },
        { id: "n2", kind: "condition", label: "High-Complexity Task?", config: { criteria: "reasoning" }, position: { x: 1, y: 0 } },
        { id: "n3", kind: "agent", label: "Dispatch to GPT-4o / Claude", config: { agentId: agents[0].id }, position: { x: 2, y: 0 } },
        { id: "n4", kind: "agent", label: "Dispatch to Gemini Flash", config: { agentId: agents[3].id }, position: { x: 2, y: 1 } },
        { id: "n5", kind: "output", label: "Stream SSE Response", config: {}, position: { x: 3, y: 0 } },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3", label: "yes" },
        { id: "e3", source: "n2", target: "n4", label: "no" },
        { id: "e4", source: "n3", target: "n5" },
        { id: "e5", source: "n4", target: "n5" },
      ],
    },
    {
      name: "Automated Code Review & Security Gate",
      description: "Scans repository commits, identifies vulnerabilities, verifies test coverage, and drafts PR review summaries.",
      status: "DRAFT" as const,
      nodes: [
        { id: "n1", kind: "trigger", label: "Git Push Webhook", config: { event: "vcs.push" }, position: { x: 0, y: 0 } },
        { id: "n2", kind: "agent", label: "Security & Syntax Audit", config: { agentId: agents[2].id }, position: { x: 1, y: 0 } },
        { id: "n3", kind: "action", label: "Publish Review Comments", config: { target: "pull_request" }, position: { x: 2, y: 0 } },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
      ],
    },
  ];

  for (const def of workflowDefs) {
    const wf = await prisma.workflow.create({
      data: {
        name: def.name,
        description: def.description,
        status: def.status,
        nodes: def.nodes,
        edges: def.edges,
        organizationId: org.id,
        createdById: admin.id,
      },
    });
    console.log(`   ✓ ${wf.name} [${wf.status}]`);
  }
  console.log();

  /* ── 6. Conversations & Authentic Discussions ─────────────────────────── */
  console.log("💬  Initializing authentic platform conversations…");
  const conv1 = await prisma.conversation.create({
    data: {
      title: "System Architecture & Scaling Strategy",
      agentId: agents[2].id, // Code Architect
      userId: admin.id,
      pinned: true,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        role: "user",
        content: "What is the recommended architecture for deploying NEXUS AI across high-concurrency microservices?",
      },
      {
        conversationId: conv1.id,
        role: "assistant",
        content:
          "For enterprise-scale deployments, NEXUS AI is structured into four decoupled layers:\n\n1. **Edge & Client Layer**: Next.js 15 App Router providing server-rendered pages and streaming SSE responses.\n2. **Orchestration & Gateway**: Python FastAPI gateway with token bucket rate-limiting and connection pooling.\n3. **Persistence**: PostgreSQL managed by Prisma with connection pooling for ACID metadata transactions.\n4. **Adaptive AI Mesh**: Provider-agnostic router distributing requests across OpenAI, Anthropic, and Google Gemini with automatic fallback.",
      },
    ],
  });

  const conv2 = await prisma.conversation.create({
    data: {
      title: "Document RAG Indexing Strategy",
      agentId: agents[3].id, // RAG Synthesizer
      userId: admin.id,
      pinned: false,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        role: "user",
        content: "How does the Intelligent Storage engine process newly uploaded markdown and PDF files?",
      },
      {
        conversationId: conv2.id,
        role: "assistant",
        content:
          "When a document is uploaded, the storage pipeline performs the following actions in sequence:\n\n1. **Integrity Validation**: Computes SHA-256 checksum and inspects MIME boundaries.\n2. **Text Parsing**: Extracts structured text and headers from markdown or PDF binaries.\n3. **AI Summarization**: Generates an executive summary and high-relevance keyword tags.\n4. **Vector Chunking**: Segments the content into overlapping token windows for hybrid retrieval.",
      },
    ],
  });

  console.log(`   ✓ Conversation 1: "${conv1.title}"`);
  console.log(`   ✓ Conversation 2: "${conv2.title}"\n`);

  /* ── 7. Real Knowledge Documents ───────────────────────────────────────── */
  console.log("📚  Indexing platform knowledge documents…");
  const knowledgeDocs = [
    { title: "NEXUS AI System Architecture & Microservices Guide", mimeType: "text/markdown", status: "INDEXED", chunkCount: 1240, sizeBytes: 52_000, organizationId: org.id },
    { title: "Enterprise Multi-Model LLM Routing Specification", mimeType: "text/markdown", status: "INDEXED", chunkCount: 860, sizeBytes: 38_000, organizationId: org.id },
    { title: "Security, RBAC & SOC-2 Compliance Manual", mimeType: "text/markdown", status: "INDEXED", chunkCount: 940, sizeBytes: 44_000, organizationId: org.id },
    { title: "Intelligent Storage & Vector Search Pipeline Documentation", mimeType: "text/markdown", status: "INDEXED", chunkCount: 620, sizeBytes: 28_000, organizationId: org.id },
  ];

  for (const doc of knowledgeDocs) {
    await prisma.knowledgeDocument.create({ data: doc });
    console.log(`   ✓ ${doc.title} (${doc.chunkCount} chunks)`);
  }
  console.log();

  /* ── 8. Real Storage Folders ───────────────────────────────────────────── */
  console.log("📁  Creating storage folders…");
  const folders = await Promise.all([
    prisma.storageFolder.create({ data: { name: "Architecture", path: "/Architecture", color: "#6272f5", organizationId: org.id } }),
    prisma.storageFolder.create({ data: { name: "Documentation", path: "/Documentation", color: "#a855f7", organizationId: org.id } }),
    prisma.storageFolder.create({ data: { name: "Security", path: "/Security", color: "#10b981", organizationId: org.id } }),
    prisma.storageFolder.create({ data: { name: "Guidelines", path: "/Guidelines", color: "#06b6d4", organizationId: org.id } }),
  ]);

  for (const f of folders) {
    console.log(`   ✓ ${f.path}`);
  }
  console.log();

  /* ── 9. Real Storage Files ─────────────────────────────────────────────── */
  console.log("📄  Registering verified storage files…");
  const file1 = await prisma.storageFile.create({
    data: {
      name: "Nexus_AI_Architecture.md",
      originalName: "Nexus_AI_Architecture.md",
      mimeType: "text/markdown",
      category: "document",
      sizeBytes: BigInt(52_000),
      storageUrl: "/uploads/Nexus_AI_Architecture.md",
      folderId: folders[0].id,
      folderPath: "/Architecture",
      isStarred: true,
      checksum: crypto.createHash("sha256").update("nexus_arch").digest("hex"),
      virusScanStatus: "CLEAN",
      tags: ["architecture", "microservices", "nexus-ai"],
      aiSummary: "Comprehensive architectural documentation covering the Next.js frontend, Python FastAPI gateway, Prisma database layer, and multi-model routing mesh.",
      aiKeywords: ["architecture", "gateway", "microservices", "prisma", "nextjs"],
      organizationId: org.id,
      uploadedById: admin.id,
    },
  });

  const file2 = await prisma.storageFile.create({
    data: {
      name: "Enterprise_Security_Policy.md",
      originalName: "Enterprise_Security_Policy.md",
      mimeType: "text/markdown",
      category: "document",
      sizeBytes: BigInt(44_000),
      storageUrl: "/uploads/Enterprise_Security_Policy.md",
      folderId: folders[2].id,
      folderPath: "/Security",
      isStarred: true,
      checksum: crypto.createHash("sha256").update("nexus_sec").digest("hex"),
      virusScanStatus: "CLEAN",
      tags: ["security", "compliance", "encryption", "rbac"],
      aiSummary: "Security policy detailing TLS 1.3 in transit, AES-256 at rest, JWT authentication standards, and strict zero-data-retention for LLM inference.",
      aiKeywords: ["security", "encryption", "rbac", "jwt", "compliance"],
      organizationId: org.id,
      uploadedById: admin.id,
    },
  });

  const file3 = await prisma.storageFile.create({
    data: {
      name: "Multi_Model_Routing_Guide.md",
      originalName: "Multi_Model_Routing_Guide.md",
      mimeType: "text/markdown",
      category: "document",
      sizeBytes: BigInt(38_000),
      storageUrl: "/uploads/Multi_Model_Routing_Guide.md",
      folderId: folders[1].id,
      folderPath: "/Documentation",
      isStarred: false,
      checksum: crypto.createHash("sha256").update("nexus_route").digest("hex"),
      virusScanStatus: "CLEAN",
      tags: ["models", "routing", "openai", "claude", "gemini"],
      aiSummary: "Operational guide detailing how Nexus Auto classifies tasks and balances queries across OpenAI, Anthropic, and Google Gemini with graceful fallback.",
      aiKeywords: ["routing", "gpt-4o", "claude-3-5-sonnet", "gemini-flash", "fallback"],
      organizationId: org.id,
      uploadedById: admin.id,
    },
  });

  console.log(`   ✓ ${file1.name}`);
  console.log(`   ✓ ${file2.name}`);
  console.log(`   ✓ ${file3.name}\n`);

  /* ── 10. AI Processing Jobs & Audit Logs ───────────────────────────────── */
  await prisma.aiProcessingJob.create({
    data: {
      fileId: file1.id,
      jobType: "SUMMARIZE",
      status: "COMPLETED",
      progress: 100,
      result: { summary: file1.aiSummary, wordCount: 1420 },
    },
  });

  await prisma.aiProcessingJob.create({
    data: {
      fileId: file2.id,
      jobType: "EMBED",
      status: "COMPLETED",
      progress: 100,
      result: { vectorsIndexed: 24, dimensions: 1536 },
    },
  });

  await prisma.accessLog.create({
    data: {
      fileId: file1.id,
      action: "VIEW",
      userId: admin.id,
      ipAddress: "127.0.0.1",
      userAgent: "Nexus Client",
    },
  });

  console.log("────────────────────────────────────────────────────────");
  console.log("✅  Production seed successfully applied!");
  console.log("   Organization:  Nexus AI Global Labs");
  console.log("   Admin:         Jaswant Karun <admin@nexus.ai> / Admin@nexus123!");
  console.log("   Member:        Alex Rivera <member@nexus.ai> / Member@nexus123!");
  console.log("   Agents:        5 Active Multi-Model Agents");
  console.log("   Workflows:     3 Production Workflows");
  console.log("   Storage Files: 3 Real Documentation Files");
  console.log("────────────────────────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed execution error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
