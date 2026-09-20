"use client";

import { useState, useCallback, useRef } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { formatBytes, getMimeCategory, MOCK_FOLDERS } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { UploadTask } from "@/types/storage";
import Link from "next/link";

function getMimeIcon(mimeType: string) {
  const cat = getMimeCategory(mimeType);
  return { document: "📄", image: "🖼️", video: "🎬", audio: "🎵", archive: "📦", code: "💻", spreadsheet: "📊", presentation: "📑", other: "📁" }[cat];
}

function getMimeColor(mimeType: string) {
  const cat = getMimeCategory(mimeType);
  return {
    document: "text-red-400 bg-red-500/10", image: "text-emerald-400 bg-emerald-500/10",
    video: "text-blue-400 bg-blue-500/10", audio: "text-amber-400 bg-amber-500/10",
    archive: "text-orange-400 bg-orange-500/10", code: "text-cyan-400 bg-cyan-500/10",
    spreadsheet: "text-green-400 bg-green-500/10", presentation: "text-rose-400 bg-rose-500/10",
    other: "text-dark-300 bg-dark-700/50",
  }[cat];
}

export default function UploadPage() {
  const inputRef     = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [tasks, setTasks]       = useState<UploadTask[]>([]);
  const [uploading, setUploading] = useState(false);
  const [folderId, setFolderId]   = useState<string>("");

  const addFiles = useCallback((files: File[]) => {
    const newTasks: UploadTask[] = files.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f, name: f.name, sizeBytes: f.size,
      mimeType: f.type || "application/octet-stream",
      folderId: folderId || null,
      status: "queued", progress: 0,
    }));
    setTasks((prev) => [...prev, ...newTasks]);
  }, [folderId]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  const cancel = (id: string) =>
    setTasks((p) => p.filter((t) => t.id !== id));

  const uploadAll = async () => {
    const queued = tasks.filter((t) => t.status === "queued");
    if (!queued.length || uploading) return;
    setUploading(true);
    for (const task of queued) {
      setTasks((p) => p.map((t) => t.id === task.id ? { ...t, status: "uploading", progress: 5 } : t));
      // Simulate chunked progress
      for (let pct = 10; pct <= 90; pct += Math.floor(Math.random() * 20 + 10)) {
        await new Promise((r) => setTimeout(r, 180));
        setTasks((p) => p.map((t) => t.id === task.id ? { ...t, progress: Math.min(pct, 90) } : t));
      }
      // Fake API call
      await new Promise((r) => setTimeout(r, 600));
      setTasks((p) => p.map((t) => t.id === task.id ? { ...t, status: "done", progress: 100 } : t));
    }
    setUploading(false);
  };

  const queued  = tasks.filter((t) => t.status === "queued").length;
  const active  = tasks.filter((t) => t.status === "uploading").length;
  const done    = tasks.filter((t) => t.status === "done").length;
  const usedBytes  = 13_250_000_000;
  const quotaBytes = 15_000_000_000;
  const usedPct    = (usedBytes / quotaBytes) * 100;

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          {/* Top bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-dark-950/95 backdrop-blur-sm px-6 py-3">
            <h1 className="text-base font-bold text-white">Upload Center</h1>
            <button type="button" onClick={uploadAll} disabled={uploading || queued === 0}
              className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-600/25">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {uploading ? "Uploading…" : `Upload ${queued > 0 ? `${queued} file${queued !== 1 ? "s" : ""}` : ""}`}
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Storage used banner */}
            <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-dark-400">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                  <span className="text-sm font-bold text-white">{formatBytes(usedBytes)}</span>
                  <span className="text-sm text-dark-400">used from {formatBytes(quotaBytes)}</span>
                </div>
                <Link href="/storage/settings" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Upgrade storage →</Link>
              </div>
              <div className="mt-3 h-3 w-full rounded-full bg-dark-700 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-brand-500 to-purple-500 transition-all" style={{ width: `${usedPct}%` }} />
              </div>
              <div className="flex items-center gap-5 mt-2 text-[11px] text-dark-400">
                {[
                  { label: "Compressed", color: "bg-blue-500" },
                  { label: "Spreadsheet", color: "bg-brand-500" },
                  { label: "Others", color: "bg-purple-500" },
                ].map((c) => (
                  <span key={c.label} className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", c.color)} />{c.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Dropzone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 cursor-pointer transition-all",
                dragging ? "border-brand-500 bg-brand-500/8 scale-[1.005]"
                         : "border-white/10 bg-dark-900/30 hover:border-brand-500/40 hover:bg-dark-800/30"
              )}
            >
              <div className={cn("flex h-20 w-20 items-center justify-center rounded-2xl mb-5 transition-colors",
                dragging ? "bg-brand-500/20" : "bg-dark-800/80")}>
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={dragging ? "#6272f5" : "#73758d"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-base font-semibold text-white">{dragging ? "Release to add files" : "Upload your files"}</p>
              <p className="mt-1.5 text-sm text-dark-400">
                Drag and drop your files here or{" "}
                <span className="text-brand-400 font-medium hover:text-brand-300 transition-colors">choose files</span>
              </p>
              <input ref={inputRef} type="file" multiple onChange={handleInput} className="hidden" aria-label="Upload files" />
            </div>

            {/* Folder selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-dark-300 shrink-0">Upload to folder:</label>
              <select value={folderId} onChange={(e) => setFolderId(e.target.value)}
                className="rounded-xl border border-white/10 bg-dark-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500/60">
                <option value="">Root (My Files)</option>
                {MOCK_FOLDERS.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Upload queue */}
            {tasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Uploading
                    {active > 0 && <span className="ml-2 text-brand-400">· {active} active</span>}
                    {done > 0   && <span className="ml-2 text-emerald-400">· {done} done</span>}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setTasks([])}
                      className="text-xs text-dark-400 hover:text-white transition-colors">Cancel All</button>
                    <span className="text-dark-600">·</span>
                    <button type="button" onClick={() => inputRef.current?.click()}
                      className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14"/></svg>
                      Upload more files
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-lg shrink-0", getMimeColor(task.mimeType))}>
                          {getMimeIcon(task.mimeType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-white truncate">{task.name}</p>
                            {task.status === "done" ? (
                              <span className="text-emerald-400 shrink-0">
                                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              </span>
                            ) : (task.status === "queued" || task.status === "error") && (
                              <button type="button" onClick={() => cancel(task.id)}
                                className="text-xs text-dark-400 hover:text-white border border-dark-600 hover:border-red-500/50 hover:text-red-400 rounded-lg px-2.5 py-1 transition-colors shrink-0">
                                Cancel Upload
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-dark-400">{formatBytes(task.sizeBytes)}</p>
                          <div className="mt-2">
                            <div className="h-1.5 w-full rounded-full bg-dark-700 overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all duration-300",
                                  task.status === "done"    ? "bg-emerald-500" :
                                  task.status === "error"   ? "bg-red-500" :
                                  task.status === "uploading" ? "bg-gradient-to-r from-brand-500 to-purple-500" :
                                  "bg-dark-600"
                                )}
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-[10px] text-dark-500">
                                {task.status === "done" ? `Upload finished to path: ${task.name}` :
                                 task.status === "uploading" ? `Uploading to path: ${task.name}` :
                                 task.status === "queued" ? "Queued" : task.error ?? ""}
                              </p>
                              <span className="text-[10px] font-semibold text-dark-400">{task.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All documents section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-bold text-white">All documents</h2>
                  <p className="text-xs text-dark-400 mt-0.5">Overview of every file or document that you have stored.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-dark-800/60 hover:bg-dark-700/60 px-3 py-2 text-xs font-medium text-dark-200 transition-colors">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                    Filter
                  </button>
                  <Link href="/storage/files" className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-dark-800/60 hover:bg-dark-700/60 px-3 py-2 text-xs font-medium text-dark-200 transition-colors">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    List
                  </Link>
                  <Link href="/storage/files" className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-dark-800/60 hover:bg-dark-700/60 px-3 py-2 text-xs font-medium text-dark-200 transition-colors">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Grid
                  </Link>
                </div>
              </div>

              {/* Mini file list */}
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_120px_140px_160px_40px] items-center gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-dark-500">
                  <span className="w-4" />
                  <span>File name</span>
                  <span>Size</span>
                  <span>Date uploaded</span>
                  <span>Owner</span>
                  <span />
                </div>
                {[
                  { name: "Annual-report-Q4-023.pdf",  size: "1.3 MB", date: "Dec 2, 2023", owner: "Alex Turner",   avatar: "AT", mimeType: "application/pdf" },
                  { name: "Q3-sales-summary.xlsx",      size: "420 KB", date: "Nov 28, 2023", owner: "Maria Santos",  avatar: "MS", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
                  { name: "Brand-guidelines-v2.pdf",    size: "8.9 MB", date: "Nov 15, 2023", owner: "Jaswant Karun", avatar: "JK", mimeType: "application/pdf" },
                  { name: "Product-roadmap-2024.pptx",  size: "3.1 MB", date: "Nov 10, 2023", owner: "Jaswant Karun", avatar: "JK", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
                ].map((f) => (
                  <Link key={f.name} href="/storage/files"
                    className="grid grid-cols-[auto_1fr_120px_140px_160px_40px] items-center gap-4 px-5 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-dark-800/40 transition-colors group">
                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-dark-500 bg-dark-700 accent-brand-500" />
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center text-sm shrink-0", getMimeColor(f.mimeType))}>
                        {getMimeIcon(f.mimeType)}
                      </div>
                      <span className="text-sm text-white truncate group-hover:text-brand-300 transition-colors">{f.name}</span>
                    </div>
                    <span className="text-xs text-dark-400">{f.size}</span>
                    <span className="text-xs text-dark-400">{f.date}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-[9px] font-bold text-white">{f.avatar}</div>
                      <span className="text-xs text-dark-300 truncate">{f.owner}</span>
                    </div>
                    <button type="button" onClick={(e) => e.preventDefault()}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-all">
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
