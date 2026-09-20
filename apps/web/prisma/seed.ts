                                                                                                                                                                                                                                                                                            /**
 * NEXUS AI — PostgreSQL Seed Script
 * Run: pnpm db:seed
 *
 * What gets stored in each table:
 * ──────────────────────────────────────────────────────
 * Organization     – company name, slug, billing plan
 * User             – name, email, hashed password, role, avatar
 * Agent            – AI agent config (model, system prompt, tools, status)
 * Conversation     – chat session between user and agent
 * Message          – individual chat messages (user / assistant / system)
 * Workflow         – visual pipeline (nodes + edges as JSON)
 * KnowledgeDocument– indexed documents (title, mime, chunk count, size)
 * StorageFolder    – folder tree (name, path, color, parent)
 * StorageFile      – uploaded file metadata (mime, size, checksum, AI data)
 * FileVersion      – per-file version history
 * FileShare        – shareable links with permission + expiry
 * AiProcessingJob  – background AI jobs (OCR, summarise, embed…)
 * AccessLog        – audit trail of every file action
 * ──────────────────────────────────────────────────────
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

/* ─── DB client ──────────────────────────────────────────────────────────── */
const pool    = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const hash  = (p: string) => bcrypt.hash(p, 12);
const token = () => crypto.randomBytes(24).toString("hex");
const cuid  = () => crypto.randomBytes(12).toString("hex"); // simple id stand-in

async function main() {
  console.log("🌱  Starting NEXUS AI seed…\n");

  /* ── 1. Wipe existing data (safe for dev) ─────────────────────────────── */
  console.log("🗑   Clearing existing data…");
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
  console.log("   ✓ Done\n");

  /* ── 2. Organization ──────────────────────────────────────────────────── */
  console.log("🏢  Creating organization…");
  const org = await prisma.organization.create({
    data: {
      name: "Nexus Enterprise",
      slug: "nexus-enterprise",
      plan: "ENTERPRISE",
    },
  });
  console.log(`   ✓ ${org.name} (${org.id})\n`);

  /* ── 3. Users ─────────────────────────────────────────────────────────── */
  console.log("👤  Creating users…");
  const adminHash  = await hash("Admin@nexus123!");
  const memberHash = await hash("Member@nexus123!");

  const admin = await prisma.user.create({
    data: {
      name:           "Jaswant Karun",
      email:          "admin@nexus.ai",
      passwordHash:   adminHash,
      role:           "ADMIN",
      organizationId: org.id,
    },
  });

  const member = await prisma.user.create({
    data: {
      name:           "Alex Member",
      email:          "member@nexus.ai",
      passwordHash:   memberHash,
      role:           "MEMBER",
      organizationId: org.id,
    },
  });

  console.log(`   ✓ ${admin.name}  <${admin.email}>  role=ADMIN`);
  console.log(`   ✓ ${member.name} <${member.email}> role=MEMBER\n`);

  /* ── 4. Agents ────────────────────────────────────────────────────────── */
  console.log("🤖  Creating AI agents…");
  const agentDefs = [
    {
      name:        "Data Analyst Agent",
      description: "Analyses datasets, generates statistical summaries, and produces visualisation-ready insights using GPT-4o with code-execution.",
      config: {
        model:        "gpt-4o",
        provider:     "openai",
        temperature:  0.2,
        maxTokens:    8192,
        systemPrompt: "You are an expert data analyst. Analyse the provided data and generate clear, actionable insights. Always show your reasoning.",
        tools:        ["code_interpreter", "search", "file_read"],
      },
    },
    {
      name:        "Customer Support Bot",
      description: "Handles customer queries with empathy and accuracy using the company knowledge base via RAG.",
      config: {
        model:        "claude-3-5-sonnet",
        provider:     "anthropic",
        temperature:  0.5,
        maxTokens:    4096,
        systemPrompt: "You are a helpful customer support agent for Nexus AI. Always be friendly, concise, and accurate. Escalate when unsure.",
        tools:        ["knowledge_search", "ticket_create"],
      },
    },
    {
      name:        "Code Review Assistant",
      description: "Reviews pull requests, identifies security issues, and suggests improvements across TypeScript, Python, and Go.",
      config: {
        model:        "gpt-4o",
        provider:     "openai",
        temperature:  0.1,
        maxTokens:    16384,
        systemPrompt: "You are a senior software engineer performing thorough code reviews. Focus on correctness, security, performance, and readability.",
        tools:        ["code_interpreter", "search"],
      },
    },
    {
      name:        "RAG Document Synthesizer",
      description: "Answers questions grounded in uploaded documents using hybrid BM25 + vector search over Qdrant.",
      config: {
        model:        "gemini-1-5-pro",
        provider:     "google",
        temperature:  0.3,
        maxTokens:    8192,
        systemPrompt: "You are a document analysis expert. Answer questions strictly based on the provided context. Cite sources inline.",
        tools:        ["vector_search", "knowledge_search", "file_read"],
      },
    },
    {
      name:        "Workflow Orchestrator",
      description: "Coordinates multi-agent pipelines, delegates tasks, aggregates results, and manages retries automatically.",
      config: {
        model:        "gpt-4o",
        provider:     "openai",
        temperature:  0.0,
        maxTokens:    8192,
        systemPrompt: "You are the master orchestrator. Break complex tasks into sub-tasks, delegate to specialist agents, and synthesise their outputs.",
        tools:        ["agent_call", "code_interpreter", "search"],
      },
    },
  ];

  const agents = [];
  for (const def of agentDefs) {
    const agent = await prisma.agent.create({
      data: {
        name:           def.name,
        description:    def.description,
        status:         "ACTIVE",
        config:         def.config,
        organizationId: org.id,
        createdById:    admin.id,
      },
    });
    agents.push(agent);
    console.log(`   ✓ ${agent.name}`);
  }
  console.log();

  /* ── 5. Workflows ─────────────────────────────────────────────────────── */
  console.log("⚡  Creating workflows…");
  const workflowDefs = [
    {
      name:        "Customer Onboarding Pipeline",
      description: "Automates new customer onboarding: CRM sync, welcome email, knowledge-base setup, and initial agent assignment.",
      status:      "ACTIVE" as const,
      nodes: [
        { id: "n1", kind: "trigger",   label: "New Customer Webhook",      config: { event: "customer.created" },   position: { x: 0, y: 0 } },
        { id: "n2", kind: "agent",     label: "Extract Customer Data",     config: { agentId: agents[0].id },       position: { x: 1, y: 0 } },
        { id: "n3", kind: "action",    label: "Create CRM Record",         config: { service: "salesforce" },       position: { x: 2, y: 0 } },
        { id: "n4", kind: "agent",     label: "Send Welcome Email",        config: { agentId: agents[1].id },       position: { x: 3, y: 0 } },
        { id: "n5", kind: "output",    label: "Log to Dashboard",          config: {},                              position: { x: 4, y: 0 } },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
        { id: "e4", source: "n4", target: "n5" },
      ],
    },
    {
      name:        "Document Intelligence Pipeline",
      description: "Ingests uploaded PDFs, extracts text via OCR, generates AI summaries, creates embeddings, and indexes for semantic search.",
      status:      "ACTIVE" as const,
      nodes: [
        { id: "n1", kind: "trigger",   label: "File Upload Event",         config: { event: "storage.file.created" }, position: { x: 0, y: 0 } },
        { id: "n2", kind: "action",    label: "Virus Scan",                config: { service: "clamav" },             position: { x: 1, y: 0 } },
        { id: "n3", kind: "agent",     label: "OCR & Text Extract",        config: { agentId: agents[3].id },         position: { x: 2, y: 0 } },
        { id: "n4", kind: "agent",     label: "Generate AI Summary",       config: { agentId: agents[3].id },         position: { x: 3, y: 0 } },
        { id: "n5", kind: "action",    label: "Create Embeddings",         config: { model: "text-embedding-3-small" }, position: { x: 4, y: 0 } },
        { id: "n6", kind: "action",    label: "Index to Vector DB",        config: { collection: "documents" },       position: { x: 5, y: 0 } },
        { id: "n7", kind: "output",    label: "Mark as Indexed",           config: {},                                position: { x: 6, y: 0 } },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
        { id: "e4", source: "n4", target: "n5" },
        { id: "e5", source: "n5", target: "n6" },
        { id: "e6", source: "n6", target: "n7" },
      ],
    },
    {
      name:        "Lead Qualification Workflow",
      description: "Scores inbound leads using AI, routes high-value prospects to sales, and auto-replies to low-value ones.",
      status:      "DRAFT" as const,
      nodes: [
        { id: "n1", kind: "trigger",   label: "Form Submission",           config: { event: "lead.form.submit" }, position: { x: 0, y: 0 } },
        { id: "n2", kind: "agent",     label: "Score Lead",                config: { agentId: agents[0].id },    position: { x: 1, y: 0 } },
        { id: "n3", kind: "condition", label: "Score > 80?",               config: { threshold: 80 },            position: { x: 2, y: 0 } },
        { id: "n4", kind: "action",    label: "Assign to Sales Rep",       config: { team: "sales" },            position: { x: 3, y: 0 } },
        { id: "n5", kind: "action",    label: "Send Nurture Email",        config: { template: "nurture_v2" },   position: { x: 3, y: 1 } },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4", label: "yes" },
        { id: "e4", source: "n3", target: "n5", label: "no" },
      ],
    },
  ];

  for (const def of workflowDefs) {
    const wf = await prisma.workflow.create({
      data: {
        name:           def.name,
        description:    def.description,
        status:         def.status,
        nodes:          def.nodes,
        edges:          def.edges,
        organizationId: org.id,
        createdById:    admin.id,
      },
    });
    console.log(`   ✓ ${wf.name} [${wf.status}]`);
  }
  console.log();

  /* ── 6. Conversations + Messages ─────────────────────────────────────── */
  console.log("💬  Creating conversations and messages…");

  const conv1 = await prisma.conversation.create({
    data: {
      title:    "Data Analysis: Q2 Sales Report",
      agentId:  agents[0].id,
      userId:   admin.id,
      pinned:   true,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        role:    "system",
        content: "You are an expert data analyst. Analyse the provided data and generate clear, actionable insights.",
      },
      {
        conversationId: conv1.id,
        role:    "user",
        content: "Can you analyse our Q2 2026 sales data and identify the top 3 growth opportunities?",
      },
      {
        conversationId: conv1.id,
        role:    "assistant",
        content: "Based on the Q2 2026 sales data, I've identified the following top 3 growth opportunities:\n\n**1. Enterprise Segment Expansion (+34% YoY potential)**\nEnterprise accounts represent 18% of customers but 62% of revenue. Increasing enterprise conversion from 8% to 12% could yield $2.4M additional ARR.\n\n**2. AI Agent Studio Upsell (+28% revenue lift)**\nOnly 31% of active users have enabled AI Agent Studio. A targeted in-app campaign could push this to 55%, adding approximately $890K ARR.\n\n**3. Geographic Expansion: APAC Region**\nAPAC shows 41% lower churn than EMEA at similar contract values. Increasing APAC sales headcount by 3 reps is projected to return 6.2x ROI within 18 months.",
      },
      {
        conversationId: conv1.id,
        role:    "user",
        content: "Can you create a detailed action plan for the enterprise segment expansion?",
      },
      {
        conversationId: conv1.id,
        role:    "assistant",
        content: "Here is a 90-day action plan for Enterprise Segment Expansion:\n\n**Phase 1 (Days 1–30): Discovery & Targeting**\n- Build ICP (Ideal Customer Profile) scoring model using existing enterprise account attributes\n- Identify 150 high-fit prospects from CRM data\n- Deploy Data Analyst Agent to enrich prospect records with public data\n\n**Phase 2 (Days 31–60): Outbound Campaign**\n- Launch personalised multi-touch sequences (email + LinkedIn + phone)\n- Host 2 executive roundtables on AI workflow automation\n- Enable RAG Document Synthesizer for custom demo preparation\n\n**Phase 3 (Days 61–90): Conversion & Close**\n- Run proof-of-concept with top 20 prospects\n- Deploy Customer Support Bot to handle mid-sales Q&A\n- Target 6 closed-won deals at average ACV of $42K",
      },
    ],
  });

  const conv2 = await prisma.conversation.create({
    data: {
      title:    "Code Review: Authentication Service",
      agentId:  agents[2].id,
      userId:   member.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        role:    "user",
        content: "Please review the JWT authentication implementation in our Node.js service.",
      },
      {
        conversationId: conv2.id,
        role:    "assistant",
        content: "I've reviewed the JWT authentication implementation. Here are my findings:\n\n**🔴 Critical Issues:**\n1. `JWT_SECRET` falls back to a hardcoded string — always require it to be set explicitly\n2. Token expiry is not validated on refresh — expired tokens can be used to obtain new tokens\n\n**🟡 Moderate Issues:**\n3. Missing `aud` and `iss` claims — adds defence against token substitution attacks\n4. No token revocation mechanism — consider a Redis-backed blocklist for logout flows\n\n**🟢 Suggestions:**\n5. Use `RS256` (asymmetric) instead of `HS256` in multi-service deployments\n6. Add rate limiting to `/auth/login` — currently unbounded brute-force possible",
      },
    ],
  });

  console.log(`   ✓ Conversation: "${conv1.title}" (${await prisma.message.count({ where: { conversationId: conv1.id } })} messages)`);
  console.log(`   ✓ Conversation: "${conv2.title}" (${await prisma.message.count({ where: { conversationId: conv2.id } })} messages)\n`);

  /* ── 7. Knowledge Documents ──────────────────────────────────────────── */
  console.log("📚  Creating knowledge documents…");
  const knowledgeDocs = [
    { title: "NEXUS AI Product Documentation v2.0", mimeType: "application/pdf",   status: "INDEXED", chunkCount: 1420, sizeBytes: 12_400_000 },
    { title: "Customer Knowledge Base — FAQ",        mimeType: "text/markdown",     status: "INDEXED", chunkCount: 890,  sizeBytes: 4_200_000  },
    { title: "Q3 2026 Financial Report",             mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", status: "INDEXED", chunkCount: 2150, sizeBytes: 18_900_000 },
    { title: "System Architecture Specification",   mimeType: "text/plain",        status: "INDEXED", chunkCount: 540,  sizeBytes: 1_800_000  },
    { title: "Enterprise API Reference Guide",      mimeType: "application/pdf",   status: "INDEXED", chunkCount: 3210, sizeBytes: 24_600_000 },
    { title: "Onboarding Playbook 2026",            mimeType: "application/pdf",   status: "INDEXED", chunkCount: 680,  sizeBytes: 8_100_000  },
  ];

  for (const doc of knowledgeDocs) {
    await prisma.knowledgeDocument.create({ data: doc });
    console.log(`   ✓ ${doc.title} (${doc.chunkCount} chunks)`);
  }
  console.log();

  /* ── 8. Storage Folders ──────────────────────────────────────────────── */
  console.log("📁  Creating storage folders…");
  const rootFolders = await Promise.all([
    prisma.storageFolder.create({ data: { name: "AI Research",    path: "/AI Research",    color: "#6272f5", organizationId: org.id } }),
    prisma.storageFolder.create({ data: { name: "Reports",        path: "/Reports",        color: "#a855f7", organizationId: org.id } }),
    prisma.storageFolder.create({ data: { name: "Images",         path: "/Images",         color: "#10b981", organizationId: org.id } }),
    prisma.storageFolder.create({ data: { name: "Presentations",  path: "/Presentations",  color: "#f59e0b", organizationId: org.id } }),
    prisma.storageFolder.create({ data: { name: "Datasets",       path: "/Datasets",       color: "#06b6d4", organizationId: org.id } }),
  ]);

  // Sub-folder under AI Research
  const subFolder = await prisma.storageFolder.create({
    data: { name: "Transformer Papers", path: "/AI Research/Transformer Papers", color: "#6272f5", parentId: rootFolders[0].id, organizationId: org.id },
  });

  for (const f of [...rootFolders, subFolder]) {
    console.log(`   ✓ ${f.path}`);
  }
  console.log();

  /* ── 9. Storage Files ────────────────────────────────────────────────── */
  console.log("📄  Creating storage files…");
  const fileDefs = [
    {
      name: "Transformer_Architecture.pdf", mimeType: "application/pdf", category: "document",
      sizeBytes: BigInt(4_200_000), folderId: rootFolders[0].id, folderPath: "/AI Research",
      isStarred: true, virusScanStatus: "CLEAN" as const,
      aiSummary: "Comprehensive overview of transformer architecture including self-attention mechanisms, positional encodings, encoder-decoder stacks, and multi-head attention. Covers BERT, GPT, and T5 variants.",
      aiKeywords: ["transformer", "attention", "encoder", "decoder", "BERT", "GPT"],
      tags: ["AI", "research", "NLP"],
    },
    {
      name: "Q2_Financial_Report.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", category: "spreadsheet",
      sizeBytes: BigInt(1_800_000), folderId: rootFolders[1].id, folderPath: "/Reports",
      virusScanStatus: "CLEAN" as const,
      aiSummary: "Q2 2026 financial summary: Revenue $4.2M (+28% YoY), ARR $16.8M, NRR 118%, Gross Margin 74%.",
      aiKeywords: ["revenue", "ARR", "growth", "margin", "Q2"],
      tags: ["finance", "Q2", "quarterly"],
    },
    {
      name: "System_Architecture_Diagram.png", mimeType: "image/png", category: "image",
      sizeBytes: BigInt(2_400_000), folderId: rootFolders[2].id, folderPath: "/Images",
      isStarred: true, virusScanStatus: "CLEAN" as const,
      tags: ["architecture", "diagram", "infrastructure"],
    },
    {
      name: "Nexus_AI_Pitch_Deck.pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", category: "presentation",
      sizeBytes: BigInt(22_000_000), folderId: rootFolders[3].id, folderPath: "/Presentations",
      isStarred: true, virusScanStatus: "CLEAN" as const,
      aiSummary: "Investor pitch deck covering product overview, market size ($180B TAM), traction metrics, team, and roadmap.",
      aiKeywords: ["pitch", "investors", "TAM", "roadmap", "traction"],
      tags: ["pitch", "investors", "deck"],
    },
    {
      name: "training_dataset_v3.csv", mimeType: "text/csv", category: "spreadsheet",
      sizeBytes: BigInt(56_000_000), folderId: rootFolders[4].id, folderPath: "/Datasets",
      virusScanStatus: "CLEAN" as const,
      aiKeywords: ["dataset", "training", "ML", "classification"],
      tags: ["dataset", "ML", "training"],
    },
    {
      name: "Product_Demo_Recording.mp4", mimeType: "video/mp4", category: "video",
      sizeBytes: BigInt(142_000_000), folderId: null, folderPath: "/",
      virusScanStatus: "CLEAN" as const,
      aiSummary: "60-second product walkthrough demonstrating AI Agent Studio, Workflow Builder, and Smart Storage.",
      tags: ["demo", "product", "video"],
    },
    {
      name: "Meeting_Recording_Sprint24.mp3", mimeType: "audio/mpeg", category: "audio",
      sizeBytes: BigInt(18_000_000), folderId: null, folderPath: "/",
      virusScanStatus: "CLEAN" as const,
      aiKeywords: ["sprint", "roadmap", "Q3", "planning", "team"],
      tags: ["meeting", "sprint", "audio"],
    },
    {
      name: "Attention_Is_All_You_Need.pdf", mimeType: "application/pdf", category: "document",
      sizeBytes: BigInt(1_900_000), folderId: subFolder.id, folderPath: "/AI Research/Transformer Papers",
      virusScanStatus: "CLEAN" as const,
      aiSummary: "Seminal 2017 paper introducing the Transformer architecture. Proposes self-attention to replace recurrence for sequence modelling.",
      aiKeywords: ["attention", "transformer", "self-attention", "Vaswani", "NeurIPS"],
      tags: ["paper", "AI", "research"],
    },
  ];

  const storedFiles = [];
  for (const def of fileDefs) {
    const checksum = crypto.createHash("sha256").update(def.name + def.sizeBytes.toString()).digest("hex");
    const file = await prisma.storageFile.create({
      data: {
        name: def.name, originalName: def.name,
        mimeType: def.mimeType, category: def.category,
        sizeBytes: def.sizeBytes,
        storageUrl: `/uploads/${org.id}/${checksum}${def.mimeType.includes("pdf") ? ".pdf" : ""}`,
        folderId: def.folderId ?? null,
        folderPath: def.folderPath,
        isStarred: def.isStarred ?? false,
        checksum,
        virusScanStatus: def.virusScanStatus,
        aiSummary: def.aiSummary ?? null,
        aiKeywords: def.aiKeywords ?? [],
        tags: def.tags ?? [],
        organizationId: org.id,
        uploadedById: admin.id,
      },
    });
    storedFiles.push(file);
    console.log(`   ✓ ${file.name} (${(Number(file.sizeBytes) / 1e6).toFixed(1)} MB)`);
  }
  console.log();

  /* ── 10. File Versions ───────────────────────────────────────────────── */
  console.log("🕒  Creating file versions…");
  const pdfFile = storedFiles[0]; // Transformer_Architecture.pdf
  for (let v = 1; v <= 3; v++) {
    const vCheck = crypto.createHash("sha256").update(`${pdfFile.id}-v${v}`).digest("hex");
    await prisma.fileVersion.create({
      data: {
        fileId:        pdfFile.id,
        versionNumber: v,
        sizeBytes:     BigInt(3_600_000 + v * 200_000),
        storageUrl:    `/uploads/${org.id}/versions/${pdfFile.id}/v${v}.pdf`,
        checksum:      vCheck,
        changeNote:    v === 1 ? "Initial upload" : v === 2 ? "Revised Section 3 — Attention Mechanism" : "Added appendix on BERT variants",
        createdById:   admin.id,
      },
    });
  }
  console.log(`   ✓ 3 versions for "${pdfFile.name}"`);

  const pptFile = storedFiles[3]; // Pitch Deck
  for (let v = 1; v <= 5; v++) {
    const vCheck = crypto.createHash("sha256").update(`${pptFile.id}-v${v}`).digest("hex");
    await prisma.fileVersion.create({
      data: {
        fileId:        pptFile.id,
        versionNumber: v,
        sizeBytes:     BigInt(18_000_000 + v * 1_000_000),
        storageUrl:    `/uploads/${org.id}/versions/${pptFile.id}/v${v}.pptx`,
        checksum:      vCheck,
        changeNote:    ["Initial draft", "Added market slides", "Updated financials", "Added product demo screenshots", "Final investor version"][v - 1],
        createdById:   admin.id,
      },
    });
  }
  console.log(`   ✓ 5 versions for "${pptFile.name}"\n`);

  /* ── 11. File Shares ─────────────────────────────────────────────────── */
  console.log("🔗  Creating file shares…");
  const shareData = [
    { file: storedFiles[0], permission: "DOWNLOAD" as const, isPublic: true,  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { file: storedFiles[3], permission: "VIEW"     as const, isPublic: false, downloadLimit: 10 },
    { file: storedFiles[2], permission: "VIEW"     as const, isPublic: true  },
  ];
  for (const s of shareData) {
    await prisma.fileShare.create({
      data: {
        fileId:        s.file.id,
        token:         token(),
        permission:    s.permission,
        isPublic:      s.isPublic,
        expiresAt:     s.expiresAt ?? null,
        downloadLimit: s.downloadLimit ?? null,
        createdById:   admin.id,
      },
    });
    console.log(`   ✓ Share link for "${s.file.name}" [${s.permission}]`);
  }
  console.log();

  /* ── 12. AI Processing Jobs ──────────────────────────────────────────── */
  console.log("🧠  Creating AI processing jobs…");
  const jobDefs: { file: typeof storedFiles[0]; jobType: "SUMMARIZE"|"EMBED"|"EXTRACT"|"VIRUS_SCAN"|"THUMBNAIL"|"TRANSCRIBE"|"OCR"; status: "COMPLETED"|"PROCESSING"|"PENDING"|"FAILED" }[] = [
    { file: storedFiles[0], jobType: "VIRUS_SCAN", status: "COMPLETED" },
    { file: storedFiles[0], jobType: "EXTRACT",    status: "COMPLETED" },
    { file: storedFiles[0], jobType: "SUMMARIZE",  status: "COMPLETED" },
    { file: storedFiles[0], jobType: "EMBED",       status: "COMPLETED" },
    { file: storedFiles[1], jobType: "VIRUS_SCAN", status: "COMPLETED" },
    { file: storedFiles[1], jobType: "EXTRACT",    status: "COMPLETED" },
    { file: storedFiles[2], jobType: "THUMBNAIL",  status: "COMPLETED" },
    { file: storedFiles[3], jobType: "VIRUS_SCAN", status: "COMPLETED" },
    { file: storedFiles[3], jobType: "SUMMARIZE",  status: "COMPLETED" },
    { file: storedFiles[5], jobType: "THUMBNAIL",  status: "COMPLETED" },
    { file: storedFiles[5], jobType: "TRANSCRIBE", status: "PROCESSING" },
    { file: storedFiles[6], jobType: "TRANSCRIBE", status: "PENDING" },
    { file: storedFiles[7], jobType: "SUMMARIZE",  status: "COMPLETED" },
    { file: storedFiles[7], jobType: "EMBED",       status: "COMPLETED" },
  ];
  const now = new Date();
  for (const j of jobDefs) {
    await prisma.aiProcessingJob.create({
      data: {
        fileId:      j.file.id,
        jobType:     j.jobType,
        status:      j.status,
        progress:    j.status === "COMPLETED" ? 100 : j.status === "PROCESSING" ? 62 : 0,
        startedAt:   j.status !== "PENDING" ? now : null,
        completedAt: j.status === "COMPLETED" ? now : null,
        result:      j.status === "COMPLETED"
          ? (j.jobType === "EMBED" ? { chunks: 142, dimensions: 1536 } : j.jobType === "SUMMARIZE" ? { wordCount: 380 } : { success: true })
          : undefined,
      },
    });
  }
  console.log(`   ✓ ${jobDefs.length} AI processing jobs created\n`);

  /* ── 13. Access Logs ─────────────────────────────────────────────────── */
  console.log("🔐  Creating access logs…");
  const logActions = [
    { file: storedFiles[0], action: "view",     userId: admin.id,  ip: "49.36.12.44" },
    { file: storedFiles[0], action: "download", userId: admin.id,  ip: "49.36.12.44" },
    { file: storedFiles[3], action: "share",    userId: admin.id,  ip: "49.36.12.44" },
    { file: storedFiles[1], action: "view",     userId: member.id, ip: "103.21.58.91" },
    { file: storedFiles[2], action: "download", userId: member.id, ip: "103.21.58.91" },
    { file: storedFiles[3], action: "view",     userId: null,       ip: "185.220.101.5" },
  ];
  for (const log of logActions) {
    await prisma.accessLog.create({
      data: {
        fileId:    log.file.id,
        action:    log.action,
        userId:    log.userId,
        ipAddress: log.ip,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
  }
  console.log(`   ✓ ${logActions.length} access log entries created\n`);

  /* ── Summary ─────────────────────────────────────────────────────────── */
  console.log("─".repeat(56));
  console.log("✅  Seed complete! Database summary:\n");

  const counts = {
    Organization:     await prisma.organization.count(),
    User:             await prisma.user.count(),
    Agent:            await prisma.agent.count(),
    Workflow:         await prisma.workflow.count(),
    Conversation:     await prisma.conversation.count(),
    Message:          await prisma.message.count(),
    KnowledgeDocument:await prisma.knowledgeDocument.count(),
    StorageFolder:    await prisma.storageFolder.count(),
    StorageFile:      await prisma.storageFile.count(),
    FileVersion:      await prisma.fileVersion.count(),
    FileShare:        await prisma.fileShare.count(),
    AiProcessingJob:  await prisma.aiProcessingJob.count(),
    AccessLog:        await prisma.accessLog.count(),
  };

  for (const [table, count] of Object.entries(counts)) {
    console.log(`   ${table.padEnd(22)} ${String(count).padStart(4)} row(s)`);
  }
  console.log();
  console.log("🔑  Test credentials:");
  console.log("   Admin:  admin@nexus.ai   /  Admin@nexus123!");
  console.log("   Member: member@nexus.ai  /  Member@nexus123!");
  console.log("─".repeat(56));
}

main()
  .catch((e) => { console.error("❌  Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
