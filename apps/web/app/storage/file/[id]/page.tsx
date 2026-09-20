"use client";

import { useState, use } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { FileIcon } from "@/components/storage/FileIcon";
import { formatBytes, relativeTime, virusBadge, MOCK_FILES } from "@/lib/storage";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const file = MOCK_FILES.find((f) => f.id === id) ?? MOCK_FILES[0];

  const scanBadge = virusBadge(file.virusScanStatus);
  const tabs = ["Overview", "AI Insights", "Versions", "Access Log", "Sharing"];
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          {/* Back */}
          <Link href="/storage/files" className="inline-flex items-center gap-1.5 text-sm text-dark-300 hover:text-white transition-colors">
            ← Back to Files
          </Link>

          {/* File header */}
          <div className="flex items-start gap-5 rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
            <FileIcon mimeType={file.mimeType} size="xl" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold text-white truncate">{file.name}</h1>
              <p className="mt-1 text-sm text-dark-300">{file.folderPath} · {formatBytes(file.sizeBytes)} · {relativeTime(file.updatedAt)}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", scanBadge.classes)}>
                  {file.virusScanStatus === "clean" ? "🛡️" : "⚠️"} {scanBadge.label}
                </span>
                {file.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-dark-700 px-2.5 py-0.5 text-xs text-dark-300">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={file.storageUrl} className="rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2 text-sm font-medium text-white text-center transition-colors">
                ⬇️ Download
              </a>
              <Link href={`/storage/shared?file=${file.id}`} className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium text-white text-center transition-colors">
                🔗 Share
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            {tabs.map((t) => (
              <button key={t} type="button" onClick={() => setActiveTab(t)}
                className={cn("px-5 py-3 text-sm font-medium transition-colors relative cursor-pointer active:scale-95",
                  t === activeTab
                    ? "text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500"
                    : "text-dark-300 hover:text-white")}>
                {t}
              </button>
            ))}
          </div>

          {/* Overview content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metadata */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
                <h2 className="text-sm font-semibold text-white mb-4">File Metadata</h2>
                <dl className="grid grid-cols-2 gap-3">
                  {[
                    ["Original Name", file.originalName],
                    ["MIME Type",     file.mimeType],
                    ["File Size",     formatBytes(file.sizeBytes)],
                    ["Category",      file.category],
                    ["Checksum",      file.checksum.slice(0, 16) + "…"],
                    ["Downloads",     String(file.downloadCount)],
                    ["Versions",      String(file.versionCount)],
                    ["Uploaded",      new Date(file.createdAt).toLocaleString()],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-dark-400">{k}</dt>
                      <dd className="mt-0.5 text-sm text-white font-mono truncate">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* AI Summary */}
              {file.aiSummary && (
                <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-5">
                  <h2 className="text-sm font-semibold text-brand-400 mb-2">🤖 AI Summary</h2>
                  <p className="text-sm text-dark-100 leading-relaxed">{file.aiSummary}</p>
                  {file.aiKeywords && file.aiKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {file.aiKeywords.map((kw) => (
                        <span key={kw} className="rounded-full bg-brand-500/15 text-brand-300 px-2.5 py-0.5 text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Side stats */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 space-y-3">
                <h2 className="text-sm font-semibold text-white">Security</h2>
                {[
                  { label: "Virus Scan",  value: scanBadge.label,  ok: file.virusScanStatus === "clean" },
                  { label: "Encryption",  value: "AES-256",         ok: true },
                  { label: "Checksum",    value: "SHA-256",         ok: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-dark-300">{s.label}</span>
                    <span className={cn("text-xs font-semibold", s.ok ? "text-emerald-400" : "text-red-400")}>
                      {s.ok ? "✓" : "✕"} {s.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 space-y-3">
                <h2 className="text-sm font-semibold text-white">AI Processing</h2>
                {[
                  { label: "Text Extraction", done: true },
                  { label: "Summarization",   done: !!file.aiSummary },
                  { label: "Embeddings",      done: true },
                  { label: "Thumbnail",       done: !!file.thumbnailUrl },
                ].map((j) => (
                  <div key={j.label} className="flex items-center justify-between">
                    <span className="text-xs text-dark-300">{j.label}</span>
                    <span className={cn("text-xs font-semibold", j.done ? "text-emerald-400" : "text-amber-400")}>
                      {j.done ? "✓ Done" : "⏳ Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
