"use client";

import { useState } from "react";
import Link from "next/link";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { FileIcon } from "@/components/storage/FileIcon";
import { formatBytes, MOCK_FILES, MOCK_FOLDERS } from "@/lib/storage";
import { cn } from "@/lib/utils";

/* ── Top bar ─────────────────────────────────────────────────────── */
function TopBar() {
  const [query, setQuery] = useState("");
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/[0.06] bg-dark-950/95 backdrop-blur-sm px-6 py-3">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-3.5 py-2 text-xs font-semibold text-brand-300 hover:text-white transition-all shadow-sm group shrink-0"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        <span>Back to Dashboard</span>
      </Link>

      <div className="relative flex-1 max-w-xl">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your files…"
          className="w-full rounded-2xl border border-white/[0.08] bg-dark-800/60 py-2 pl-10 pr-4 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition" />
      </div>

      <Link href="/storage/upload"
        className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all shrink-0">
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Upload files
      </Link>
    </div>
  );
}

/* ── Quick Access cards ──────────────────────────────────────────── */
const QUICK_ACCESS = [
  { id: "f1", name: "AI Research",   files: 24, icon: "📁", color: "from-brand-500/20 to-brand-700/10", border: "border-brand-500/25", href: "/storage/files?folder=f1",
    avatars: ["JK", "AM", "+5"] },
  { id: "qa2", name: "Brand Guideline.pdf", files: null, size: "12 MB", icon: "📄", color: "from-red-500/15 to-red-700/5", border: "border-red-500/20", href: "/storage/file/file1",
    avatars: ["JK", "TL", "+8"] },
  { id: "qa3", name: "Product_Demo.mp4", files: null, size: "142 MB", icon: "🎬", color: "from-blue-500/15 to-blue-700/5", border: "border-blue-500/20", href: "/storage/file/file4",
    avatars: ["JK"] },
];

/* ── Folder cards (like MyCloud) ──────────────────────────────────── */
/* ── Recent files table ──────────────────────────────────────────── */

export default function StorageDashboardPage() {
  const recentFiles = MOCK_FILES.filter((f) => !f.isTrashed).slice(0, 6);
  const rootFolders = MOCK_FOLDERS.filter((f) => !f.parentId).slice(0, 4);

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <TopBar />

          <div className="px-6 py-6 space-y-8">
            {/* Quick Access */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Quick Access</h2>
                <Link href="/storage/files" className="text-xs text-dark-400 hover:text-brand-400 transition-colors flex items-center gap-1">
                  View all
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {QUICK_ACCESS.map((item) => (
                  <Link key={item.id} href={item.href}
                    className={cn(
                      "group relative flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-5 transition-all hover:scale-[1.01] hover:shadow-xl",
                      item.color, item.border
                    )}>
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                        {item.icon}
                      </div>
                      {/* Overlap avatars */}
                      <div className="flex -space-x-2">
                        {item.avatars.map((a, i) => (
                          <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 border border-dark-950 flex items-center justify-center text-[9px] font-bold text-white">
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-xs text-dark-300 mt-0.5">
                        {item.files !== null ? `${item.files} files` : item.size}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Folders */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Folders</h2>
                <Link href="/storage/files" className="text-xs text-dark-400 hover:text-brand-400 transition-colors flex items-center gap-1">
                  View all
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {rootFolders.map((folder) => (
                  <Link key={folder.id} href={`/storage/files?folder=${folder.id}`}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-dark-900/60 p-4 hover:border-brand-500/25 hover:bg-dark-800/60 transition-all">
                    {/* Folder icon with stacked look */}
                    <div className="relative h-12 w-14">
                      <div className="absolute top-0 left-0 h-9 w-12 rounded-lg opacity-30" style={{ backgroundColor: folder.color ?? "#6272f5" }} />
                      <div className="absolute top-2 left-1 h-10 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: folder.color ?? "#6272f5" }}>
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.8}>
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                    </div>
                    {/* 3-dot menu */}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{folder.name}</p>
                        <p className="text-[11px] text-dark-400 mt-0.5">
                          {folder.fileCount} files · {formatBytes(folder.totalSize)}
                        </p>
                      </div>
                      <button type="button" onClick={(e) => e.preventDefault()}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-all">
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Recent Files */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Recent Files</h2>
                <Link href="/storage/files" className="text-xs text-dark-400 hover:text-brand-400 transition-colors flex items-center gap-1">
                  View all
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[auto_1fr_140px_120px_100px] items-center gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                  <span className="w-8" />
                  <span>Name</span>
                  <span className="hidden md:block">Last modified</span>
                  <span className="hidden md:block">Member</span>
                  <span />
                </div>
                {recentFiles.map((file) => (
                  <Link key={file.id} href={`/storage/file/${file.id}`}
                    className="grid grid-cols-[auto_1fr_140px_120px_100px] items-center gap-4 px-5 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-dark-800/40 transition-colors group">
                    <FileIcon mimeType={file.mimeType} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors">{file.name}</p>
                      <p className="text-[11px] text-dark-500 mt-0.5">{formatBytes(file.sizeBytes)}</p>
                    </div>
                    <span className="hidden md:block text-xs text-dark-400">
                      {new Date(file.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="hidden md:block text-xs text-dark-300">Only you</span>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={(e) => e.preventDefault()}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-colors">
                        <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
