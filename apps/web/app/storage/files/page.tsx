"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { StorageBreadcrumb } from "@/components/storage/StorageBreadcrumb";
import { FileIcon } from "@/components/storage/FileIcon";
import { StorageEmptyState } from "@/components/storage/StorageEmptyState";
import { formatBytes, relativeTime, MOCK_FILES, MOCK_FOLDERS, getFolderBreadcrumbs } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { StorageFile } from "@/types/storage";

type SortKey = "name" | "size" | "updated" | "type";
type ViewMode = "list" | "grid";

/* ── Context menu ───────────────────────────────────────────────── */
function ContextMenu({ file, onClose }: { file: StorageFile; onClose: () => void }) {
  return (
    <div className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-white/10 bg-dark-800/95 backdrop-blur-sm shadow-2xl py-1.5 overflow-hidden">
      {[
        { icon: "⬇️", label: "Download", href: file.storageUrl },
        { icon: "🔗", label: "Share",    href: null },
        { icon: "✏️", label: "Rename",   href: null },
        { icon: "📋", label: "Copy",     href: null },
        { icon: "✂️", label: "Move",     href: null },
        { icon: "⭐", label: file.isStarred ? "Unstar" : "Star", href: null },
        { icon: "🗑️", label: "Delete",   href: null, danger: true },
      ].map((item) => (
        <button key={item.label} type="button"
          onClick={onClose}
          className={cn(
            "flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors",
            item.danger ? "text-red-400 hover:bg-red-500/10" : "text-dark-200 hover:bg-white/[0.06] hover:text-white"
          )}>
          <span>{item.icon}</span>{item.label}
        </button>
      ))}
    </div>
  );
}

/* ── File row (list view) ──────────────────────────────────────── */
function FileRow({ file, selected, onSelect }: {
  file: StorageFile;
  selected: boolean;
  onSelect: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Link href={`/storage/file/${file.id}`}
      className={cn(
        "grid grid-cols-[auto_auto_1fr_100px_140px_120px_40px] items-center gap-3 px-5 py-3 border-b border-white/[0.04] last:border-0 hover:bg-dark-800/50 transition-colors group",
        selected && "bg-brand-500/5"
      )}>
      <input type="checkbox" checked={selected} onChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="h-3.5 w-3.5 rounded border-dark-500 bg-dark-700 accent-brand-500" />
      <FileIcon mimeType={file.mimeType} size="sm" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors">{file.name}</p>
      </div>
      <span className="text-xs text-dark-400">{formatBytes(file.sizeBytes)}</span>
      <span className="text-xs text-dark-400 hidden md:block">
        {new Date(file.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
      </span>
      <span className="text-xs text-dark-400 hidden lg:block">Only you</span>
      <div className="relative flex justify-end" onClick={(e) => e.preventDefault()}>
        <button type="button"
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-all">
          <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
        {menuOpen && <ContextMenu file={file} onClose={() => setMenuOpen(false)} />}
      </div>
    </Link>
  );
}

/* ── File card (grid view) ─────────────────────────────────────── */
function FileGridCard({ file, selected, onSelect }: { file: StorageFile; selected: boolean; onSelect: () => void }) {
  return (
    <Link href={`/storage/file/${file.id}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border p-4 cursor-pointer transition-all hover:border-brand-500/25 hover:bg-dark-800/60",
        selected ? "border-brand-500/40 bg-brand-500/5" : "border-white/[0.06] bg-dark-900/60"
      )}>
      <input type="checkbox" checked={selected} onChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 left-3 h-3.5 w-3.5 rounded border-dark-500 bg-dark-700 accent-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between mb-3">
        <FileIcon mimeType={file.mimeType} size="md" />
        {file.isStarred && <span className="text-amber-400 text-sm">★</span>}
      </div>
      <p className="text-sm font-medium text-white truncate">{file.name}</p>
      <p className="text-xs text-dark-500 mt-1">{formatBytes(file.sizeBytes)}</p>
      <p className="text-[10px] text-dark-600 mt-0.5">{relativeTime(file.updatedAt)}</p>
    </Link>
  );
}

/* ── Folder card ──────────────────────────────────────────────── */
function FolderCard({ folder }: { folder: typeof MOCK_FOLDERS[0] }) {
  return (
    <Link href={`/storage/files?folder=${folder.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-dark-900/60 p-4 hover:border-brand-500/20 hover:bg-dark-800/60 transition-all">
      <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: (folder.color ?? "#6272f5") + "30" }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill={folder.color ?? "#6272f5"} stroke="none">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{folder.name}</p>
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

  const [view, setView]         = useState<ViewMode>("list");
  const [sort, setSort]         = useState<SortKey>("updated");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const crumbs = useMemo(() => {
    const base = [{ label: "Storage", href: "/storage" }, { label: "Files", href: "/storage/files" }];
    if (!folderId) return base;
    return [...base, ...getFolderBreadcrumbs(folderId, MOCK_FOLDERS).map((c) => ({
      label: c.name, href: `/storage/files?folder=${c.id}`,
    }))];
  }, [folderId]);

  const subFolders = useMemo(() =>
    MOCK_FOLDERS.filter((f) => folderId ? f.parentId === folderId : f.parentId === null),
    [folderId]
  );

  const files = useMemo(() => {
    const list = MOCK_FILES.filter((f) =>
      !f.isTrashed &&
      (showStarred ? f.isStarred : true) &&
      (folderId ? f.folderId === folderId : true) &&
      (search ? f.name.toLowerCase().includes(search.toLowerCase()) : true)
    );
    const sorts: Record<SortKey, (a: StorageFile, b: StorageFile) => number> = {
      name:    (a, b) => a.name.localeCompare(b.name),
      size:    (a, b) => b.sizeBytes - a.sizeBytes,
      updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
      type:    (a, b) => a.category.localeCompare(b.category),
    };
    return [...list].sort(sorts[sort]);
  }, [folderId, showStarred, search, sort]);

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
      <NavBar brandName="NEXUS AI" />
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
            {/* Breadcrumb */}
            <StorageBreadcrumb crumbs={crumbs} />

            {/* Bulk action bar */}
            {selected.size > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-brand-600/10 border border-brand-500/25 px-4 py-2.5">
                <span className="text-sm font-semibold text-brand-400">{selected.size} selected</span>
                <div className="h-4 w-px bg-brand-500/30" />
                {[
                  { label: "Download", icon: "⬇️" },
                  { label: "Share",    icon: "🔗" },
                  { label: "Move",     icon: "✂️" },
                  { label: "Delete",   icon: "🗑️", danger: true },
                ].map((a) => (
                  <button key={a.label} type="button"
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
                title={search ? `No results for "${search}"` : "This folder is empty"}
                description={search ? "Try a different keyword" : "Upload files or create a folder to get started"}
                action={<Link href="/storage/upload" className="rounded-xl bg-brand-600 hover:bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors">Upload Files</Link>}
              />
            ) : (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-dark-500 mb-3">Files</p>
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
                      <span className="hidden lg:block">Owner</span>
                      <span />
                    </div>
                    {files.map((f) => (
                      <FileRow key={f.id} file={f} selected={selected.has(f.id)} onSelect={() => toggleSelect(f.id)} />
                    ))}
                    {/* Pagination hint */}
                    <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
                      <p className="text-xs text-dark-500">{files.length} files · {formatBytes(files.reduce((a, f) => a + f.sizeBytes, 0))}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, "...", 12].map((p, i) => (
                          <button key={i} type="button"
                            className={cn("h-7 min-w-7 rounded-lg text-xs font-medium transition-colors px-2",
                              p === 1 ? "bg-brand-600 text-white" : "text-dark-400 hover:bg-white/5 hover:text-white")}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {files.map((f) => (
                      <FileGridCard key={f.id} file={f} selected={selected.has(f.id)} onSelect={() => toggleSelect(f.id)} />
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
