/**
 * NEXUS AI — AI-Aware Intelligent Storage Engine Types
 */

export type FileType = "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | "CODE" | "ARCHIVE" | "UNKNOWN";
export type PermissionRole = "VIEWER" | "EDITOR" | "ADMIN" | "OWNER";
export type StorageClass = "STANDARD" | "NEARLINE" | "COLDLINE" | "ARCHIVE";
export type UploadStatus = "INITIALIZED" | "IN_PROGRESS" | "COMPLETED" | "ABORTED" | "EXPIRED";
export type ModerationStatus = "PASSED" | "FLAGGED" | "BLOCKED" | "REVIEW_REQUIRED";
export type BackupType = "FULL" | "INCREMENTAL" | "DIFFERENTIAL";
export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface StorageBucket {
  id: string;
  name: string;
  description?: string;
  region: string;
  isPublic: boolean;
  versioningEnabled: boolean;
  encryptionAlgorithm: string;
  quotaBytes: number;
  usedBytes: number;
  createdAt: string;
  updatedAt: string;
}

export interface StorageObject {
  id: string;
  bucketId: string;
  objectKey: string;
  sizeBytes: number;
  etag?: string;
  storageClass: StorageClass;
  contentType: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  ownerId: string;
  path: string;
  color: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileRecord {
  id: string;
  name: string;
  extension?: string;
  folderId?: string | null;
  storageObjectId?: string | null;
  ownerId: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  fileType: FileType;
  isFavorite: boolean;
  isTrashed: boolean;
  trashedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FilePermission {
  id: string;
  fileId?: string | null;
  folderId?: string | null;
  userId?: string | null;
  groupId?: string | null;
  role: PermissionRole;
  grantedBy: string;
  createdAt: string;
}

export interface FileShare {
  id: string;
  fileId: string;
  shareToken: string;
  passwordHash?: string;
  expiresAt?: string;
  maxDownloads?: number;
  downloadCount: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export interface FileVersion {
  id: string;
  fileId: string;
  versionNumber: number;
  storageObjectId: string;
  sizeBytes: number;
  checksum: string;
  comment?: string;
  createdBy: string;
  createdAt: string;
}

export interface DocumentMetadata {
  id: string;
  fileId: string;
  title?: string;
  author?: string;
  pageCount: number;
  wordCount: number;
  language: string;
  createdDate?: string;
  modifiedDate?: string;
  application?: string;
  createdAt: string;
}

export interface ExtractedText {
  id: string;
  fileId: string;
  fullText: string;
  cleanText: string;
  summary?: string;
  layoutBlocks?: Record<string, unknown>;
  createdAt: string;
}

export interface MediaMetadata {
  id: string;
  fileId: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
  aspectRatio?: string;
  codec?: string;
  bitrateBps?: number;
  frameRate?: number;
  channels?: number;
  sampleRate?: number;
  createdAt: string;
}

export interface OcrResult {
  id: string;
  fileId: string;
  pageNumber: number;
  detectedText: string;
  confidenceScore: number;
  boundingBoxes?: Record<string, unknown>;
  engine: string;
  createdAt: string;
}

export interface Transcription {
  id: string;
  fileId: string;
  transcript: string;
  language: string;
  speakerSegments?: Record<string, unknown>;
  modelUsed: string;
  confidenceScore: number;
  createdAt: string;
}

export interface EmbeddingRecord {
  id: string;
  fileId: string;
  chunkIndex: number;
  chunkText: string;
  vector: number[];
  model: string;
  createdAt: string;
}

export interface AiTag {
  id: string;
  fileId: string;
  tag: string;
  category: string;
  confidence: number;
  createdAt: string;
}

export interface ModerationResult {
  id: string;
  fileId: string;
  isFlagged: boolean;
  nsfwScore: number;
  violenceScore: number;
  hateScore: number;
  piiDetected?: Record<string, unknown>;
  status: ModerationStatus;
  reviewedAt: string;
}

export interface VirusScanResult {
  id: string;
  fileId: string;
  engine: string;
  isClean: boolean;
  threatFound?: string;
  scannedAt: string;
}

export interface AccessLog {
  id: string;
  fileId?: string;
  userId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
