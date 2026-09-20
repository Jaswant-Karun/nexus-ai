import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/db/status
 * Returns live row counts for every table + connection health.
 * Protected — requires a valid JWT cookie.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    /* Row counts for every model */
    const [
      orgCount,
      userCount,
      agentCount,
      workflowCount,
      convCount,
      msgCount,
      docCount,
      folderCount,
      fileCount,
      versionCount,
      shareCount,
      jobCount,
      logCount,
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.agent.count(),
      prisma.workflow.count(),
      prisma.conversation.count(),
      prisma.message.count(),
      prisma.knowledgeDocument.count(),
      prisma.storageFolder.count(),
      prisma.storageFile.count(),
      prisma.fileVersion.count(),
      prisma.fileShare.count(),
      prisma.aiProcessingJob.count(),
      prisma.accessLog.count(),
    ]);

    const tables = [
      {
        table:       "Organization",
        description: "Companies / tenants — every resource belongs to an org",
        columns:     ["id", "name", "slug", "plan", "createdAt", "updatedAt"],
        rows:        orgCount,
      },
      {
        table:       "User",
        description: "Platform users — stores hashed password, role, avatar",
        columns:     ["id", "email", "name", "passwordHash", "role", "organizationId", "avatarUrl", "createdAt", "updatedAt"],
        rows:        userCount,
      },
      {
        table:       "Agent",
        description: "AI agents — model, provider, systemPrompt, tools stored as JSON config",
        columns:     ["id", "name", "description", "avatar", "status", "config", "organizationId", "createdById", "createdAt", "updatedAt"],
        rows:        agentCount,
      },
      {
        table:       "Workflow",
        description: "Visual pipelines — nodes and edges stored as JSON",
        columns:     ["id", "name", "description", "status", "nodes", "edges", "organizationId", "createdById", "createdAt", "updatedAt"],
        rows:        workflowCount,
      },
      {
        table:       "Conversation",
        description: "Chat sessions between a user and an agent",
        columns:     ["id", "title", "agentId", "userId", "pinned", "lastMessageAt", "createdAt"],
        rows:        convCount,
      },
      {
        table:       "Message",
        description: "Individual chat messages (user / assistant / system / tool)",
        columns:     ["id", "conversationId", "role", "content", "toolCalls", "attachments", "createdAt"],
        rows:        msgCount,
      },
      {
        table:       "KnowledgeDocument",
        description: "Indexed knowledge-base documents for RAG pipelines",
        columns:     ["id", "title", "sourceUrl", "mimeType", "status", "chunkCount", "sizeBytes", "createdAt"],
        rows:        docCount,
      },
      {
        table:       "StorageFolder",
        description: "File system folder tree — supports nested folders via parentId",
        columns:     ["id", "name", "parentId", "path", "color", "organizationId", "isDeleted", "createdAt", "updatedAt"],
        rows:        folderCount,
      },
      {
        table:       "StorageFile",
        description: "Uploaded file metadata — mime, checksum, AI summary, keywords, tags",
        columns:     ["id", "name", "originalName", "mimeType", "category", "sizeBytes", "storageUrl", "thumbnailUrl", "folderId", "folderPath", "isStarred", "isTrashed", "trashedAt", "checksum", "virusScanStatus", "downloadCount", "tags", "aiSummary", "aiKeywords", "aiExtractedText", "encryptionKey", "organizationId", "uploadedById", "createdAt", "updatedAt"],
        rows:        fileCount,
      },
      {
        table:       "FileVersion",
        description: "Version history for each file — allows restore to any point",
        columns:     ["id", "fileId", "versionNumber", "sizeBytes", "storageUrl", "checksum", "changeNote", "createdById", "createdAt"],
        rows:        versionCount,
      },
      {
        table:       "FileShare",
        description: "Shareable links — permission level, password, expiry, download cap",
        columns:     ["id", "fileId", "token", "permission", "isPublic", "passwordHash", "expiresAt", "downloadLimit", "downloadCount", "createdById", "isRevoked", "createdAt"],
        rows:        shareCount,
      },
      {
        table:       "AiProcessingJob",
        description: "Background AI jobs — OCR, summarise, embed, transcribe, virus scan",
        columns:     ["id", "fileId", "jobType", "status", "progress", "result", "errorMessage", "startedAt", "completedAt", "createdAt"],
        rows:        jobCount,
      },
      {
        table:       "AccessLog",
        description: "Audit trail — every view, download, share, delete action on a file",
        columns:     ["id", "fileId", "action", "userId", "ipAddress", "userAgent", "createdAt"],
        rows:        logCount,
      },
    ];

    const totalRows = tables.reduce((s, t) => s + t.rows, 0);

    return NextResponse.json({
      success:   true,
      database:  "nexus_ai",
      host:      "localhost:5432",
      provider:  "PostgreSQL",
      tables:    tables.length,
      totalRows,
      data:      tables,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[db/status]", err);
    return NextResponse.json(
      { success: false, error: "Database connection failed", detail: String(err) },
      { status: 500 }
    );
  }
}
