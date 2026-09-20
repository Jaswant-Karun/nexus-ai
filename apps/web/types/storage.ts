// ─── Enums ────────────────────────────────────────────────────────────────────

export type FileCategory =
  | "document"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "spreadsheet"
  | "presentation"
  | "other";

export type AiJobStatus = "pending" | "processing" | "completed" | "failed";
export type AiJobType =
  | "ocr"
  | "summarize"
  | "embed"
  | "transcribe"
  | "extract"
  | "thumbnail"
  | "virus_scan"
  | "compress";

export type SharePermission = "view" | "download" | "edit";

// ─── Core models ──────────────────────────────────────────────────────────────

export interface StorageFolder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  color?: string;
  fileCount: number;
  totalSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface StorageFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  category: FileCategory;
  sizeBytes: number;
  storageUrl: string;
  thumbnailUrl?: string;
  folderId: string | null;
  folderPath: string;
  isStarred: boolean;
  isTrashed: boolean;
  trashedAt?: string;
  checksum: string;
  encryptionKey?: string;
  virusScanStatus: "pending" | "clean" | "infected" | "skipped";
  versionCount: number;
  downloadCount: number;
  uploadedById: string;
  orgId: string;
  tags: string[];
  aiSummary?: string;
  aiKeywords?: string[];
  aiExtractedText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileVersion {
  id: string;
  fileId: string;
  versionNumber: number;
  sizeBytes: number;
  storageUrl: string;
  changeNote?: string;
  createdById: string;
  createdAt: string;
}

export interface FileShare {
  id: string;
  fileId: string;
  fileName: string;
  token: string;
  shareUrl: string;
  permission: SharePermission;
  isPublic: boolean;
  password?: string;
  expiresAt?: string;
  downloadLimit?: number;
  downloadCount: number;
  createdById: string;
  createdAt: string;
}

export interface AiProcessingJob {
  id: string;
  fileId: string;
  fileName: string;
  jobType: AiJobType;
  status: AiJobStatus;
  progress: number; // 0–100
  result?: Record<string, unknown>;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

export interface FolderTreeNode extends StorageFolder {
  children: FolderTreeNode[];
}

export interface StorageStats {
  totalFiles: number;
  totalFolders: number;
  usedBytes: number;
  quotaBytes: number;
  usedPercent: number;
  trashedFiles: number;
  sharedFiles: number;
  aiProcessedFiles: number;
  largestFiles: Pick<StorageFile, "id" | "name" | "sizeBytes" | "mimeType">[];
  recentUploads: StorageFile[];
  categoryBreakdown: { category: FileCategory; count: number; bytes: number }[];
}

export interface UploadTask {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  mimeType: string;
  folderId: string | null;
  status: "queued" | "uploading" | "processing" | "done" | "error";
  progress: number; // 0–100
  error?: string;
  uploadedFileId?: string;
}

export interface AccessLog {
  id: string;
  fileId: string;
  fileName: string;
  action: "view" | "download" | "share" | "delete" | "restore" | "edit";
  userId: string;
  userName: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

export interface BackupRecord {
  id: string;
  type: "daily" | "weekly" | "monthly" | "manual";
  status: "completed" | "failed" | "running";
  fileCount: number;
  sizeBytes: number;
  storageUrl?: string;
  createdAt: string;
  completedAt?: string;
}
