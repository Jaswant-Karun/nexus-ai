/**
 * NEXUS AI — AI-Aware Intelligent Storage Engine Repository (DAO)
 */

import {
  FileRecord, Folder, FileVersion, DocumentMetadata, ExtractedText,
  EmbeddingRecord, AiTag, FilePermission, FileShare, AccessLog, FileType,
} from "../types/storage-engine";

export class StorageEngineRepository {
  private folders: Map<string, Folder> = new Map();
  private files: Map<string, FileRecord> = new Map();
  private versions: Map<string, FileVersion[]> = new Map();
  private extractedTexts: Map<string, ExtractedText> = new Map();
  private embeddings: Map<string, EmbeddingRecord[]> = new Map();
  private aiTags: Map<string, AiTag[]> = new Map();
  private shares: Map<string, FileShare> = new Map();

  // ── Folders ───────────────────────────────────────────────────────────────────
  public async createFolder(folder: Omit<Folder, "id" | "createdAt" | "updatedAt">): Promise<Folder> {
    const id = `fld_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const created: Folder = {
      ...folder,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.folders.set(id, created);
    return created;
  }

  public async getFolder(id: string): Promise<Folder | null> {
    return this.folders.get(id) ?? null;
  }

  public async listFolders(parentId?: string | null): Promise<Folder[]> {
    return Array.from(this.folders.values()).filter((f) => f.parentId === parentId);
  }

  // ── Files ─────────────────────────────────────────────────────────────────────
  public async createFile(file: Omit<FileRecord, "id" | "createdAt" | "updatedAt">): Promise<FileRecord> {
    const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const created: FileRecord = {
      ...file,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.files.set(id, created);
    return created;
  }

  public async getFile(id: string): Promise<FileRecord | null> {
    return this.files.get(id) ?? null;
  }

  public async listFiles(folderId?: string | null): Promise<FileRecord[]> {
    return Array.from(this.files.values()).filter((f) => f.folderId === folderId && !f.isTrashed);
  }

  public async searchFiles(query: string): Promise<FileRecord[]> {
    const q = query.toLowerCase();
    return Array.from(this.files.values()).filter(
      (f) => f.name.toLowerCase().includes(q) || f.extension?.toLowerCase().includes(q)
    );
  }

  // ── Versioning ────────────────────────────────────────────────────────────────
  public async createVersion(version: Omit<FileVersion, "id" | "createdAt">): Promise<FileVersion> {
    const id = `ver_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const created: FileVersion = {
      ...version,
      id,
      createdAt: new Date().toISOString(),
    };
    const list = this.versions.get(version.fileId) ?? [];
    list.push(created);
    this.versions.set(version.fileId, list);
    return created;
  }

  public async getVersions(fileId: string): Promise<FileVersion[]> {
    return this.versions.get(fileId) ?? [];
  }

  // ── AI Embeddings & Text Search ────────────────────────────────────────────────
  public async addEmbeddings(fileId: string, chunks: { text: string; vector: number[] }[]): Promise<EmbeddingRecord[]> {
    const records: EmbeddingRecord[] = chunks.map((c, idx) => ({
      id: `emb_${Date.now()}_${idx}`,
      fileId,
      chunkIndex: idx,
      chunkText: c.text,
      vector: c.vector,
      model: "text-embedding-3-small",
      createdAt: new Date().toISOString(),
    }));
    this.embeddings.set(fileId, records);
    return records;
  }

  public async getEmbeddings(fileId: string): Promise<EmbeddingRecord[]> {
    return this.embeddings.get(fileId) ?? [];
  }

  // ── Sharing ────────────────────────────────────────────────-------------------
  public async createShare(fileId: string, createdBy: string, expiresAt?: string): Promise<FileShare> {
    const token = `share_${Math.random().toString(36).substr(2, 12)}`;
    const share: FileShare = {
      id: `sh_${Date.now()}`,
      fileId,
      shareToken: token,
      expiresAt,
      downloadCount: 0,
      isPublic: true,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    this.shares.set(token, share);
    return share;
  }

  public async getShareByToken(token: string): Promise<FileShare | null> {
    return this.shares.get(token) ?? null;
  }
}

export const storageEngineRepo = new StorageEngineRepository();
