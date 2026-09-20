"use client";
import { useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { cn } from "@/lib/utils";

const TABS = ["General", "AI Processing", "Lifecycle", "Integrations"];

function ToggleRow({ label, desc, on }: { label: string; desc: string; on: boolean }) {
  const [val, setVal] = useState(on);
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-dark-400 mt-0.5">{desc}</p>
      </div>
      <button type="button" onClick={() => setVal((v) => !v)}
        className={cn("relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none", val ? "bg-brand-500" : "bg-dark-600")}>
        <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5", val ? "translate-x-5" : "translate-x-0.5")} />
      </button>
    </div>
  );
}

export default function StorageSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Storage Settings</h1>
            <p className="mt-1 text-sm text-dark-300">Configure quotas, AI processing, lifecycle policies, and integrations.</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            {TABS.map((t) => (
              <button key={t} type="button" onClick={() => setActiveTab(t)}
                className={cn("px-5 py-3 text-sm font-medium transition-colors relative",
                  t === activeTab
                    ? "text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500"
                    : "text-dark-300 hover:text-white")}>
                {t}
              </button>
            ))}
          </div>

          {activeTab === "General" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6 space-y-5">
                <h2 className="text-sm font-semibold text-white">Storage Quota</h2>
                <div className="space-y-4">
                  {[
                    { label: "Total Quota",     value: "2 GB",   sub: "Standard Memory Plan" },
                    { label: "Used Storage",    value: "840 MB", sub: "42% of 2 GB" },
                    { label: "Available Space", value: "1.16 GB", sub: "58% free" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between rounded-xl bg-dark-800/60 border border-white/[0.06] px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white">{s.label}</p>
                        <p className="text-xs text-dark-400 mt-0.5">{s.sub}</p>
                      </div>
                      <span className="text-base font-bold text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
                <h2 className="text-sm font-semibold text-white mb-4">Upload Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Max File Size",        value: "500 MB" },
                    { label: "Allowed File Types",    value: "All types" },
                    { label: "Virus Scan",            value: "Enabled" },
                    { label: "Auto-compress Images",  value: "Enabled" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between rounded-xl bg-dark-800/60 border border-white/[0.06] px-4 py-3">
                      <span className="text-sm text-dark-200">{s.label}</span>
                      <span className="text-sm font-medium text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "AI Processing" && (
            <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
              <h2 className="text-sm font-semibold text-white mb-4">AI Pipeline Controls</h2>
              <div className="space-y-1">
                <ToggleRow label="Auto-summarize Documents"  desc="Generate AI summaries for PDFs, DOCX and text files" on={true} />
                <ToggleRow label="Generate Embeddings"       desc="Convert file content into vector embeddings for semantic search" on={true} />
                <ToggleRow label="OCR on Images"             desc="Extract text from scanned images and photos" on={true} />
                <ToggleRow label="Transcribe Audio/Video"    desc="Auto-transcribe audio and video files using Whisper" on={false} />
                <ToggleRow label="Auto-generate Thumbnails"  desc="Create thumbnails for images, videos and documents" on={true} />
                <ToggleRow label="Extract Metadata"          desc="Extract EXIF, author, creation date from files" on={true} />
                <ToggleRow label="Build Knowledge Graph"     desc="Link related files into a knowledge graph for RAG" on={false} />
              </div>
            </div>
          )}

          {activeTab === "Lifecycle" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
                <h2 className="text-sm font-semibold text-white mb-4">Retention Policies</h2>
                <div className="space-y-3">
                  {[
                    { label: "Trash retention period",       current: "30 days" },
                    { label: "Version history limit",        current: "10 versions per file" },
                    { label: "Inactive file auto-archive",   current: "180 days" },
                    { label: "Access log retention",         current: "90 days" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <p className="text-sm text-white">{p.label}</p>
                      <span className="rounded-lg bg-dark-800 border border-white/[0.06] px-3 py-1 text-xs font-medium text-dark-200">{p.current}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Integrations" && (
            <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Storage Integrations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "AWS S3",         desc: "Store files on Amazon S3 buckets",            connected: false },
                  { name: "Google Cloud",   desc: "Google Cloud Storage backend",                connected: false },
                  { name: "Qdrant",         desc: "Vector database for embeddings",              connected: true  },
                  { name: "OpenAI",         desc: "GPT-4o for summarization & embeddings",       connected: true  },
                  { name: "ClamAV",         desc: "Open-source antivirus scanning engine",       connected: true  },
                  { name: "Elastic Search", desc: "Full-text search indexing",                   connected: false },
                ].map((i) => (
                  <div key={i.name} className="flex items-center gap-3 rounded-xl bg-dark-800/60 border border-white/[0.06] p-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{i.name}</p>
                      <p className="text-xs text-dark-400 mt-0.5">{i.desc}</p>
                    </div>
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      i.connected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-dark-700 text-dark-400 border-dark-600")}>
                      {i.connected ? "Connected" : "Connect"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button type="button" className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all">
              Save Changes
            </button>
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
