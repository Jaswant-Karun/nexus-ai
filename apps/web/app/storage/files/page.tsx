"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { StorageBreadcrumb } from "@/components/storage/StorageBreadcrumb";
import { FileIcon } from "@/components/storage/FileIcon";
import { StorageEmptyState } from "@/components/storage/StorageEmptyState";
import { formatBytes, relativeTime, getFolderBreadcrumbs } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { StorageFile, StorageFolder } from "@/types/storage";

type SortKey = "name" | "size" | "updated" | "type";
type ViewMode = "list" | "grid";

/* ── Context menu ───────────────────────────────────────────────── */
function ContextMenu({
  file,
  onClose,
  onStar,
  onDelete,
}: {
  file: StorageFile;
  onClose: () => void;
  onStar: (id: string, isStarred: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-white/10 bg-dark-800/95 backdrop-blur-sm shadow-2xl py-1.5 overflow-hidden">
      {[
        { icon: "⬇️", label: "Download", href: file.storageUrl, onClick: onClose },
        { icon: "⭐", label: file.isStarred ? "Unstar" : "Star", href: null, onClick: () => { onStar(file.id, !file.isStarred); onClose(); } },
        { icon: "🗑️", label: "Delete",   href: null, danger: true, onClick: () => { onDelete(file.id); onClose(); } },
      ].map((item) => (
        item.href ? (
          <a
            key={item.label}
            href={item.href}
            download
            onClick={item.onClick}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-dark-200 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <span>{item.icon}</span>{item.label}
          </a>
        ) : (
          <button key={item.label} type="button"
            onClick={item.onClick}
            className={cn(
              "flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors",
              item.danger ? "text-red-400 hover:bg-red-500/10" : "text-dark-200 hover:bg-white/[0.06] hover:text-white"
            )}>
            <span>{item.icon}</span>{item.label}
          </button>
        )
      ))}
    </div>
  );
}

/* ── File row (list view) ──────────────────────────────────────── */
function FileRow({
  file,
  selected,
  onSelect,
  onStar,
  onDelete,
}: {
  file: StorageFile;
  selected: boolean;
  onSelect: () => void;
  onStar: (id: string, isStarred: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_auto_1fr_100px_140px_120px_40px] items-center gap-3 px-5 py-3 border-b border-white/[0.04] last:border-0 hover:bg-dark-800/50 transition-colors group",
        selected && "bg-brand-500/5"
      )}>
      <input type="checkbox" checked={selected} onChange={onSelect}
        className="h-3.5 w-3.5 rounded border-dark-500 bg-dark-700 accent-brand-500 cursor-pointer" />
      <Link href={`/storage/file/${file.id}`} className="shrink-0">
        <FileIcon mimeType={file.mimeType} size="sm" />
      </Link>
      <div className="min-w-0">
        <Link href={`/storage/file/${file.id}`}
          className="text-sm font-medium text-white hover:text-brand-300 transition-colors truncate block">
          {file.name}
        </Link>
        <span className="text-[11px] text-dark-400 sm:hidden block">{formatBytes(file.sizeBytes)}</span>
      </div>
      <span className="hidden sm:block text-xs text-dark-300 font-mono">{formatBytes(file.sizeBytes)}</span>
      <span className="hidden md:block text-xs text-dark-400">
        {new Date(file.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
      <span className="hidden lg:block text-xs text-emerald-400 font-mono">
        {file.virusScanStatus ? file.virusScanStatus.toUpperCase() : "VERIFIED"}
      </span>
      <div className="relative flex justify-end">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-colors"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
        {menuOpen && (
          <ContextMenu
            file={file}
            onClose={() => setMenuOpen(false)}
            onStar={onStar}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}

/* ── File card (grid view) ─────────────────────────────────────── */
function FileGridCard({
  file,
  selected,
  onSelect,
  onStar,
  onDelete,
}: {
  file: StorageFile;
  selected: boolean;
  onSelect: () => void;
  onStar: (id: string, isStarred: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-dark-900/60 p-4 hover:border-brand-500/30 hover:bg-dark-800/60 transition-all",
        selected && "border-brand-500/50 bg-brand-500/5"
      )}>
      <div className="flex items-start justify-between">
        <input type="checkbox" checked={selected} onChange={onSelect}
          className="h-3.5 w-3.5 rounded border-dark-500 bg-dark-700 accent-brand-500 cursor-pointer" />
        <div className="relative">
          <button type="button" onClick={() => setMenuOpen((o) => !o)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-all">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </button>
          {menuOpen && (
            <ContextMenu
              file={file}
              onClose={() => setMenuOpen(false)}
              onStar={onStar}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
      <Link href={`/storage/file/${file.id}`} className="my-3 flex flex-col items-center text-center gap-2">
        <FileIcon mimeType={file.mimeType} size="lg" />
        <p className="text-sm font-medium text-white truncate max-w-full px-1 group-hover:text-brand-300 transition-colors">{file.name}</p>
      </Link>
      <div className="flex items-center justify-between text-[11px] text-dark-400 border-t border-white/[0.04] pt-2 font-mono">
        <span>{formatBytes(file.sizeBytes)}</span>
        <span className="text-emerald-400">{file.category.toUpperCase()}</span>
      </div>
    </div>
  );
}

/* ── Folder card ───────────────────────────────────────────────── */
function FolderCard({ folder }: { folder: StorageFolder }) {
  return (
    <Link
      href={`/storage/files?folder=${folder.id}`}
      className="group flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-dark-900/60 p-4 hover:border-brand-500/30 hover:bg-dark-800/60 transition-all">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 shrink-0">
        <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">{folder.name}</p>
        <p className="text-[11px] text-dark-400">{folder.fileCount} files · {formatBytes(folder.totalSize)}</p>
      </div>
      <button type="button" onClick={(e) => e.preventDefault()}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-all shrink-0">
        <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>
    </Link>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
function FilesContent() {
  const searchParams  = useSearchParams();
  const folderId      = searchParams.get("folder") ?? null;
  const showStarred   = searchParams.get("starred") === "true";

  const [filesList, setFilesList]     = useState<StorageFile[]>([]);
  const [foldersList, setFoldersList] = useState<StorageFolder[]>([]);
  const [loading, setLoading]         = useState(true);
  const [view, setView]               = useState<ViewMode>("list");
  const [sort, setSort]               = useState<SortKey>("updated");
  const [search, setSearch]           = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selected, setSelected]       = useState<Set<string>>(new Set());

  // Load live files and folders from Postgres DB
  useEffect(() => {
    let mounted = true;
    async function loadLiveFiles() {
      try {
        const [fRes, dRes] = await Promise.all([
          fetch("/api/storage/files", { credentials: "include" }).catch(() => null),
          fetch("/api/storage/folders", { credentials: "include" }).catch(() => null),
        ]);

        if (fRes && fRes.ok) {
          const json = await fRes.json();
          if (json.success && Array.isArray(json.data)) {
            if (mounted) setFilesList(json.data);
          }
        }

        if (dRes && dRes.ok) {
          const dJson = await dRes.json();
          if (dJson.success && Array.isArray(dJson.data)) {
            if (mounted) setFoldersList(dJson.data);
          }
        }
      } catch (err) {
        console.error("Failed to load live files:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadLiveFiles();
    return () => { mounted = false; };
  }, []);

  const handleStar = async (id: string, isStarred: boolean) => {
    setFilesList((prev) => prev.map((f) => f.id === id ? { ...f, isStarred } : f));
    await fetch("/api/storage/files", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: isStarred ? "star" : "unstar" }),
    }).catch(console.error);
  };

  const handleDelete = async (id: string) => {
    setFilesList((prev) => prev.filter((f) => f.id !== id));
    await fetch("/api/storage/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    }).catch(console.error);
  };

  const crumbs = useMemo(() => {
    const base = [{ label: "Storage", href: "/storage" }, { label: "Files", href: "/storage/files" }];
    if (!folderId) return base;
    return [...base, ...getFolderBreadcrumbs(folderId, foldersList).map((c) => ({
      label: c.name, href: `/storage/files?folder=${c.id}`,
    }))];
  }, [folderId, foldersList]);

  const subFolders = useMemo(() =>
    foldersList.filter((f) => folderId ? f.parentId === folderId : f.parentId === null),
    [folderId, foldersList]
  );

  const files = useMemo(() => {
    const list = filesList.filter((f) =>
      !f.isTrashed &&
      (showStarred ? f.isStarred : true) &&
      (folderId ? f.folderId === folderId : true) &&
      (categoryFilter !== "all" ? f.category === categoryFilter : true) &&
      (search ? f.name.toLowerCase().includes(search.toLowerCase()) : true)
    );
    const sorts: Record<SortKey, (a: StorageFile, b: StorageFile) => number> = {
      name:    (a, b) => a.name.localeCompare(b.name),
      size:    (a, b) => b.sizeBytes - a.sizeBytes,
      updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
      type:    (a, b) => a.category.localeCompare(b.category),
    };
    return [...list].sort(sorts[sort]);
  }, [filesList, folderId, showStarred, categoryFilter, search, sort]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  const selectAll = () =>
    setSelected(selected.size === files.length ? new Set() : new Set(files.map((f) => f.id)));

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          {/* Top search bar */}
          <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/[0.06] bg-dark-950/95 backdrop-blur-sm px-6 py-3">
            <div className="relative flex-1 max-w-xl">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files and folders…"
                className="w-full rounded-2xl border border-white/[0.08] bg-dark-800/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-white/10 bg-dark-800/70 px-3 py-2 text-xs text-white focus:outline-none cursor-pointer">
              <option value="updated">Last Modified</option>
              <option value="name">Name A–Z</option>
              <option value="size">Largest First</option>
              <option value="type">By Type</option>
            </select>
            <div className="flex rounded-xl border border-white/10 bg-dark-800/70 p-0.5 gap-0.5">
              {(["list", "grid"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setView(v)}
                  className={cn("rounded-lg px-3 py-1.5 transition-colors", view === v ? "bg-brand-600 text-white" : "text-dark-400 hover:text-white")}>
                  {v === "list"
                    ? <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    : <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  }
                </button>
              ))}
            </div>
            <Link href="/storage/upload" className="rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition-colors">
              + Upload
            </Link>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Breadcrumb & Catalog Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StorageBreadcrumb crumbs={crumbs} />
              <div className="flex items-center gap-2 text-xs font-mono text-dark-300">
                <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live Sync: {loading ? "Connecting…" : `${filesList.length} Items`}
                </span>
                <span className="hidden sm:inline bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  Max: 2.0 GB Quota
                </span>
              </div>
            </div>

            {/* What NexusStorage Stores Quick Overview */}
            <div className="rounded-xl border border-white/[0.08] bg-dark-900/50 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">📦</span>
                <div>
                  <span className="font-semibold text-white">NexusStorage Data Catalog: </span>
                  <span className="text-dark-300">Stores Documents (PDF/DOCX), Datasets (CSV/JSON), AI Vector Embeddings, Media, Audio Transcripts & Code</span>
                </div>
              </div>
              <Link href="/storage" className="text-brand-400 hover:text-brand-300 text-xs font-medium">
                View Full Catalog →
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "All Items", icon: "📁" },
                { id: "document", label: "Documents", icon: "📄" },
                { id: "spreadsheet", label: "Datasets & Sheets", icon: "📊" },
                { id: "image", label: "Images", icon: "🖼️" },
                { id: "video", label: "Videos", icon: "🎬" },
                { id: "audio", label: "Audio", icon: "🎵" },
                { id: "code", label: "Code & Archives", icon: "💻" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryFilter(c.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all shrink-0",
                    categoryFilter === c.id
                      ? "bg-brand-600 border-brand-500 text-white font-semibold shadow-md"
                      : "bg-dark-800/60 border-white/[0.06] text-dark-300 hover:text-white hover:bg-dark-700/60"
                  )}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            {/* Bulk action bar */}
            {selected.size > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-brand-600/10 border border-brand-500/25 px-4 py-2.5">
                <span className="text-sm font-semibold text-brand-400">{selected.size} selected</span>
                <div className="h-4 w-px bg-brand-500/30" />
                {[
                  { label: "Download", icon: "⬇️" },
                  { label: "Delete",   icon: "🗑️", danger: true, onClick: () => {
                    selected.forEach((id) => handleDelete(id));
                    setSelected(new Set());
                  }},
                ].map((a) => (
                  <button key={a.label} type="button" onClick={a.onClick}
                    className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      a.danger ? "text-red-400 hover:bg-red-500/10" : "text-dark-200 hover:bg-white/10 hover:text-white")}>
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            )}

            {/* Folders */}
            {subFolders.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-dark-500 mb-3">Folders</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {subFolders.map((f) => <FolderCard key={f.id} folder={f} />)}
                </div>
              </div>
            )}

            {/* Files */}
            {files.length === 0 ? (
              <StorageEmptyState icon={search ? "🔍" : "📂"}
                title={search ? `No results for "${search}"` : "No files match filter"}
                description={search ? "Try a different keyword" : "Upload files to get started with live storage"}
                action={<Link href="/storage/upload" className="rounded-xl bg-brand-600 hover:bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors">Upload Files</Link>}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-dark-500">
                    Files ({files.length})
                  </p>
                  <span className="text-xs text-dark-400 font-mono">
                    Total: {formatBytes(files.reduce((a, f) => a + f.sizeBytes, 0))}
                  </span>
                </div>
                {view === "list" ? (
                  <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-[auto_auto_1fr_100px_140px_120px_40px] items-center gap-3 px-5 py-3 border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-dark-500">
                      <input type="checkbox"
                        checked={selected.size === files.length && files.length > 0}
                        onChange={selectAll}
                        className="h-3.5 w-3.5 rounded border-dark-500 bg-dark-700 accent-brand-500" />
                      <span className="w-8" />
                      <span>Name</span>
                      <span>Size</span>
                      <span className="hidden md:block">Last modified</span>
                      <span className="hidden lg:block">Security Scan</span>
                      <span />
                    </div>
                    {files.map((f) => (
                      <FileRow
                        key={f.id}
                        file={f}
                        selected={selected.has(f.id)}
                        onSelect={() => toggleSelect(f.id)}
                        onStar={handleStar}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {files.map((f) => (
                      <FileGridCard
                        key={f.id}
                        file={f}
                        selected={selected.has(f.id)}
                        onSelect={() => toggleSelect(f.id)}
                        onStar={handleStar}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}

export default function FilesPage() {
  return (
    <Suspense>
      <FilesContent />
    </Suspense>
  );
}
