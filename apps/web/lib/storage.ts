import type { FileCategory, StorageFile, StorageFolder, FolderTreeNode } from "@/types/storage";

// ─── MIME → category ──────────────────────────────────────────────────────────

export function getMimeCategory(mimeType: string): FileCategory {
  if (!mimeType) return "other";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "document";
  if (mimeType.includes("word") || mimeType === "application/rtf" || mimeType === "text/plain") return "document";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet") || mimeType === "text/csv") return "spreadsheet";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "presentation";
  if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("gzip") || mimeType.includes("rar") || mimeType.includes("7z")) return "archive";
  if (
    mimeType.includes("javascript") || mimeType.includes("typescript") ||
    mimeType.includes("python") || mimeType.includes("java") ||
    mimeType.startsWith("text/x-") || mimeType === "application/json" ||
    mimeType === "text/html" || mimeType === "text/css"
  ) return "code";
  return "other";
}

// ─── Category metadata ────────────────────────────────────────────────────────

export const CATEGORY_META: Record<FileCategory, { label: string; color: string; bg: string; icon: string }> = {
  document:     { label: "Document",     color: "text-blue-400",    bg: "bg-blue-500/10",    icon: "📄" },
  image:        { label: "Image",        color: "text-emerald-400", bg: "bg-emerald-500/10", icon: "🖼️" },
  video:        { label: "Video",        color: "text-purple-400",  bg: "bg-purple-500/10",  icon: "🎬" },
  audio:        { label: "Audio",        color: "text-amber-400",   bg: "bg-amber-500/10",   icon: "🎵" },
  archive:      { label: "Archive",      color: "text-orange-400",  bg: "bg-orange-500/10",  icon: "📦" },
  code:         { label: "Code",         color: "text-cyan-400",    bg: "bg-cyan-500/10",    icon: "💻" },
  spreadsheet:  { label: "Spreadsheet",  color: "text-green-400",   bg: "bg-green-500/10",   icon: "📊" },
  presentation: { label: "Presentation", color: "text-rose-400",    bg: "bg-rose-500/10",    icon: "📑" },
  other:        { label: "Other",        color: "text-dark-300",    bg: "bg-dark-700/50",    icon: "📁" },
};

// ─── Format bytes ─────────────────────────────────────────────────────────────

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[Math.min(i, sizes.length - 1)]}`;
}

// ─── Build folder tree ────────────────────────────────────────────────────────

export function buildFolderTree(folders: StorageFolder[]): FolderTreeNode[] {
  const map = new Map<string, FolderTreeNode>();
  folders.forEach((f) => map.set(f.id, { ...f, children: [] }));

  const roots: FolderTreeNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

// ─── Breadcrumb path builder ──────────────────────────────────────────────────

export function getFolderBreadcrumbs(
  folderId: string | null,
  folders: StorageFolder[]
): { id: string; name: string }[] {
  if (!folderId) return [];
  const map = new Map(folders.map((f) => [f.id, f]));
  const crumbs: { id: string; name: string }[] = [];
  let current = map.get(folderId);
  while (current) {
    crumbs.unshift({ id: current.id, name: current.name });
    current = current.parentId ? map.get(current.parentId) : undefined;
  }
  return crumbs;
}

// ─── Extension from filename ──────────────────────────────────────────────────

export function getExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

// ─── Human-readable relative time ────────────────────────────────────────────

export function relativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = Math.floor(diff / 86400);
  if (d < 7) return `${d}d ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ─── Virus scan badge ─────────────────────────────────────────────────────────

export function virusBadge(status: StorageFile["virusScanStatus"]) {
  const map = {
    pending:  { label: "Scanning…",  classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    clean:    { label: "Clean",      classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    infected: { label: "Infected!",  classes: "bg-red-500/10 text-red-400 border-red-500/20" },
    skipped:  { label: "Skipped",    classes: "bg-dark-700/60 text-dark-300 border-dark-600/40" },
  };
  return map[status] ?? map.skipped;
}

// ─── Mock data generators (used until real API is connected) ──────────────────

export const MOCK_FOLDERS: StorageFolder[] = [
  { id: "f1", name: "AI Research",   parentId: null, path: "/AI Research",   color: "#6272f5", fileCount: 24, totalSize: 128_000_000, createdAt: "2026-07-01T10:00:00Z", updatedAt: "2026-07-29T14:30:00Z" },
  { id: "f2", name: "Reports",       parentId: null, path: "/Reports",       color: "#a855f7", fileCount: 12, totalSize: 54_000_000,  createdAt: "2026-06-15T09:00:00Z", updatedAt: "2026-07-28T11:00:00Z" },
  { id: "f3", name: "Images",        parentId: null, path: "/Images",        color: "#10b981", fileCount: 87, totalSize: 420_000_000, createdAt: "2026-05-20T08:00:00Z", updatedAt: "2026-07-30T07:00:00Z" },
  { id: "f4", name: "Presentations", parentId: null, path: "/Presentations", color: "#f59e0b", fileCount: 6,  totalSize: 89_000_000,  createdAt: "2026-07-10T12:00:00Z", updatedAt: "2026-07-25T16:00:00Z" },
  { id: "f5", name: "Datasets",      parentId: "f1", path: "/AI Research/Datasets", color: "#6272f5", fileCount: 8, totalSize: 250_000_000, createdAt: "2026-07-05T11:00:00Z", updatedAt: "2026-07-27T09:00:00Z" },
];

export const MOCK_FILES: StorageFile[] = [
  { id: "file1", name: "Transformer_Architecture.pdf",     originalName: "Transformer_Architecture.pdf",     mimeType: "application/pdf",    category: "document",    sizeBytes: 4_200_000,  storageUrl: "#", folderId: "f1", folderPath: "/AI Research",        isStarred: true,  isTrashed: false, checksum: "abc123", virusScanStatus: "clean",   versionCount: 3, downloadCount: 42,  uploadedById: "u1", orgId: "o1", tags: ["AI", "research"], aiSummary: "Comprehensive overview of transformer architecture including attention mechanisms and positional encodings.", aiKeywords: ["transformer", "attention", "encoder", "decoder"], createdAt: "2026-07-20T10:00:00Z", updatedAt: "2026-07-29T14:00:00Z" },
  { id: "file2", name: "Q2_Financial_Report.xlsx",         originalName: "Q2_Financial_Report.xlsx",         mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", category: "spreadsheet", sizeBytes: 1_800_000, storageUrl: "#", folderId: "f2", folderPath: "/Reports", isStarred: false, isTrashed: false, checksum: "def456", virusScanStatus: "clean", versionCount: 2, downloadCount: 18, uploadedById: "u1", orgId: "o1", tags: ["finance", "Q2"], createdAt: "2026-07-22T09:00:00Z", updatedAt: "2026-07-22T09:00:00Z" },
  { id: "file3", name: "System_Architecture.png",          originalName: "System_Architecture.png",          mimeType: "image/png",           category: "image",       sizeBytes: 2_400_000,  storageUrl: "#", thumbnailUrl: "#", folderId: "f3", folderPath: "/Images", isStarred: true, isTrashed: false, checksum: "ghi789", virusScanStatus: "clean", versionCount: 1, downloadCount: 5, uploadedById: "u1", orgId: "o1", tags: ["architecture", "diagram"], createdAt: "2026-07-25T11:00:00Z", updatedAt: "2026-07-25T11:00:00Z" },
  { id: "file4", name: "Product_Demo.mp4",                 originalName: "Product_Demo.mp4",                 mimeType: "video/mp4",           category: "video",       sizeBytes: 142_000_000, storageUrl: "#", folderId: null,  folderPath: "/", isStarred: false, isTrashed: false, checksum: "jkl012", virusScanStatus: "clean",  versionCount: 1, downloadCount: 23, uploadedById: "u1", orgId: "o1", tags: ["demo", "video"], aiSummary: "60-second product demonstration video.", createdAt: "2026-07-26T08:00:00Z", updatedAt: "2026-07-26T08:00:00Z" },
  { id: "file5", name: "Meeting_Recording.mp3",            originalName: "Meeting_Recording.mp3",            mimeType: "audio/mpeg",          category: "audio",       sizeBytes: 18_000_000,  storageUrl: "#", folderId: null,  folderPath: "/", isStarred: false, isTrashed: false, checksum: "mno345", virusScanStatus: "clean",  versionCount: 1, downloadCount: 7,  uploadedById: "u1", orgId: "o1", tags: ["meeting"], aiKeywords: ["roadmap", "sprint", "team"], createdAt: "2026-07-27T15:00:00Z", updatedAt: "2026-07-27T15:00:00Z" },
  { id: "file6", name: "Nexus_Pitch_Deck.pptx",            originalName: "Nexus_Pitch_Deck.pptx",            mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", category: "presentation", sizeBytes: 22_000_000, storageUrl: "#", folderId: "f4", folderPath: "/Presentations", isStarred: true, isTrashed: false, checksum: "pqr678", virusScanStatus: "clean", versionCount: 5, downloadCount: 31, uploadedById: "u1", orgId: "o1", tags: ["pitch", "deck"], createdAt: "2026-07-18T13:00:00Z", updatedAt: "2026-07-29T10:00:00Z" },
  { id: "file7", name: "old_report_draft.docx",            originalName: "old_report_draft.docx",            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", category: "document", sizeBytes: 890_000, storageUrl: "#", folderId: "f2", folderPath: "/Reports", isStarred: false, isTrashed: true, trashedAt: "2026-07-28T12:00:00Z", checksum: "stu901", virusScanStatus: "clean", versionCount: 2, downloadCount: 3, uploadedById: "u1", orgId: "o1", tags: [], createdAt: "2026-06-10T10:00:00Z", updatedAt: "2026-07-28T12:00:00Z" },
  { id: "file8", name: "training_dataset.csv",             originalName: "training_dataset.csv",             mimeType: "text/csv",            category: "spreadsheet", sizeBytes: 56_000_000, storageUrl: "#", folderId: "f5", folderPath: "/AI Research/Datasets", isStarred: false, isTrashed: false, checksum: "vwx234", virusScanStatus: "clean", versionCount: 1, downloadCount: 14, uploadedById: "u1", orgId: "o1", tags: ["dataset", "training"], createdAt: "2026-07-15T08:00:00Z", updatedAt: "2026-07-15T08:00:00Z" },
];
