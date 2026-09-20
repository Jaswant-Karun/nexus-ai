"use client";

import { useEffect, useState } from "react";
import { Sidebar, DataTable } from "@nexus/ui";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { summarizeText } from "@/lib/ai-client";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊" },
  { id: "chat",      label: "AI Agent Studio",  href: "/chat",      icon: "🤖" },
  { id: "workflow",  label: "Workflow Builder", href: "/workflow",  icon: "⚡" },
  { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠", active: true },
  { id: "storage",   label: "Storage",          href: "/storage",   icon: "☁️" },
  { id: "settings",  label: "Platform Settings",href: "/settings",  icon: "⚙️" },
];

interface KnowledgeDoc {
  id:         string;
  title:      string;
  mimeType:   string;
  chunkCount: number;
  sizeBytes:  number;
  status:     string;
  createdAt:  string;
}

function formatBytes(b: number) {
  if (b === 0) return "0 B";
  const k = 1024, sizes = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function WorkspacePage() {
  const [docs,       setDocs]       = useState<KnowledgeDoc[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [searchText, setSearchText] = useState("");
  const [aiSummary,  setAiSummary]  = useState("");
  const [summarising,setSummarising]= useState(false);

  // Load real docs from PostgreSQL via /api/knowledge
  useEffect(() => {
    fetch("/api/knowledge")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: KnowledgeDoc[] }) => {
        if (d.success && d.data) setDocs(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = docs.filter((d) =>
    d.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalChunks = docs.reduce((a, d) => a + d.chunkCount, 0);
  const totalSize   = docs.reduce((a, d) => a + d.sizeBytes, 0);

  // Summarise all document titles using the AI service
  const handleAISummarise = async () => {
    if (docs.length === 0 || summarising) return;
    setSummarising(true);
    setAiSummary("");
    try {
      const text = docs.map((d) =>
        `Document: "${d.title}" — ${d.chunkCount} chunks, ${formatBytes(d.sizeBytes)}, status: ${d.status}`
      ).join("\n");

      const res = await summarizeText({
        text,
        strategy:      "abstractive",
        max_length:    120,
        bullet_points: true,
        model:         "gpt-4o-mini",
      });
      setAiSummary(res.summary);
    } catch {
      setAiSummary("⚠️ AI service unavailable — start it with: uvicorn main:app --port 8001");
    } finally {
      setSummarising(false);
    }
  };

  const columns = [
    { key: "title",      header: "Document Title" },
    { key: "mimeType",   header: "Format" },
    {
      key: "chunkCount",
      header: "Vector Chunks",
      render: (item: KnowledgeDoc) => (
        <span className="font-mono text-xs text-cyan-300">{item.chunkCount.toLocaleString()}</span>
      ),
    },
    {
      key: "sizeBytes",
      header: "File Size",
      render: (item: KnowledgeDoc) => (
        <span className="text-xs text-dark-300">{formatBytes(item.sizeBytes)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: KnowledgeDoc) => (
        <span className={cn(
          "px-2.5 py-1 text-xs font-semibold rounded-full border",
          item.status === "INDEXED"
            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
        )}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} currentPath="/workspace"
          onNavigate={(href) => { window.location.href = href; }} />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Knowledge Base & RAG Engine</h1>
              <p className="text-gray-400 mt-1">
                {loading ? "Loading from PostgreSQL…" : `${docs.length} documents · ${totalChunks.toLocaleString()} chunks · Live data from DB`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleAISummarise} disabled={summarising || docs.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all disabled:opacity-50">
                {summarising
                  ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Summarising…</>
                  : <><span>🧠</span> AI Summary</>
                }
              </button>
              <button type="button"
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-cyan-500/20">
                + Upload Document
              </button>
            </div>
          </div>

          {/* AI Summary panel */}
          {aiSummary && (
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-5">
              <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>🧠</span> AI Summary of Knowledge Base (GPT-4o-mini via NEXUS AI Service)
              </p>
              <p className="text-sm text-dark-100 leading-relaxed">{aiSummary}</p>
            </div>
          )}

          {/* Stats — live from DB */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Indexed Documents",  value: loading ? "…" : docs.length,                      trend: "From PostgreSQL · live" },
              { title: "Total Vector Chunks", value: loading ? "…" : totalChunks.toLocaleString(),    trend: "1536-dim OpenAI embeddings" },
              { title: "Total Size",          value: loading ? "…" : formatBytes(totalSize),          trend: "Across all documents" },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-dark-400 mb-2">{s.title}</p>
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-dark-500 mt-1">{s.trend}</p>
              </div>
            ))}
          </div>

          {/* Search + table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Indexed Knowledge Repositories</h2>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search documents…"
                  className="rounded-xl border border-white/10 bg-dark-800/80 pl-9 pr-4 py-2 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/60 focus:outline-none transition"
                />
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-8 text-center">
                <div className="flex justify-center mb-3">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                </div>
                <p className="text-sm text-dark-400">Loading from PostgreSQL…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-dark-900/40 p-12 text-center">
                <p className="text-dark-400 text-sm">
                  {searchText ? "No documents match your search" : "No knowledge documents yet — run pnpm db:seed to add demo data"}
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns as never}
                data={filtered as never}
                keyExtractor={(item) => (item as unknown as KnowledgeDoc).id}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
