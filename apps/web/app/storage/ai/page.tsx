"use client";

import { useState } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { formatBytes, MOCK_FILES } from "@/lib/storage";
import { summarizeText, applyReasoning } from "@/lib/ai-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { StorageFile } from "@/types/storage";

/* ── AI document data ─────────────────────────────────────────── */
interface AiDocument extends StorageFile {
  analysisStatus: "pending" | "analyzing" | "completed" | "failed";
  docType?: string;
  uploadedAt?: string;
}

const AI_DOCS: AiDocument[] = [
  { ...MOCK_FILES[0], analysisStatus: "completed", docType: "DOCX", uploadedAt: "3/1/2025" },
  { ...MOCK_FILES[1], analysisStatus: "pending",   docType: "DOCX", uploadedAt: "3/1/2025" },
  { ...MOCK_FILES[2], analysisStatus: "pending",   docType: "PDF",  uploadedAt: "3/1/2025" },
  { ...MOCK_FILES[5], analysisStatus: "completed", docType: "PDF",  uploadedAt: "3/1/2025" },
];

const AI_TABS = [
  "Your Questions",
  "Summary",
  "Key Sections",
  "Clause Analysis",
  "Risks",
  "Compliance",
  "Missing Elements",
  "Obligations",
];

/* ── Stat cards matching image 5 ─────────────────────────────── */
const STATS = [
  { label: "Documents Analyzed",  value: "156", trend: "+12% from last month",  icon: "📄", color: "bg-purple-500/10 border-purple-500/20" },
  { label: "Questions Answered",  value: "2,340", trend: "+18% from last month", icon: "💬", color: "bg-brand-500/10 border-brand-500/20" },
  { label: "Data Points Extracted", value: "12,890", trend: "+24% from last month", icon: "📈", color: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "Processing Time Saved", value: "45h", trend: "+8% from last month", icon: "⏱️", color: "bg-amber-500/10 border-amber-500/20" },
];

/* ── Doc card — receives onAnalyze as prop ─────────────────────── */
function DocCard({ doc, selected, onSelect, onAnalyze, analyzing }: {
  doc:        AiDocument;
  selected:   boolean;
  onSelect:   () => void;
  onAnalyze:  (doc: AiDocument) => void;
  analyzing:  boolean;
}) {
  const isComplete  = doc.analysisStatus === "completed";
  const isPending   = doc.analysisStatus === "pending";
  const isAnalyzing = doc.analysisStatus === "analyzing";
  return (
    <div
      onClick={onSelect}
      className={cn(
        "rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-lg",
        selected
          ? "border-brand-500/50 bg-brand-500/8 shadow-brand-500/10"
          : "border-white/[0.08] bg-dark-900/60 hover:border-white/15"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
            <span className="text-base">📄</span>
          </div>
          <div>
            <p className="text-xs text-dark-400">{doc.uploadedAt ?? "3/1/2025"}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-dark-500">
            {new Date(doc.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="text-[10px] font-semibold text-dark-400 border border-dark-600 rounded px-1.5 py-0.5">{doc.docType}</span>
        </div>
      </div>

      <p className="text-sm font-semibold text-white mb-3 truncate">{doc.name}</p>

      <div className="flex items-center gap-2 mb-4">
        <div className={cn("h-3.5 w-3.5 rounded-full border-2 shrink-0", isComplete ? "border-transparent bg-emerald-500" : "border-dark-500 bg-transparent")} />
        <span className={cn("text-xs font-medium", isComplete ? "text-dark-300" : "text-dark-400")}>Status</span>
        <span className={cn("ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
          isComplete ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          isPending   ? "bg-dark-700 text-dark-400 border-dark-600" :
          "bg-amber-500/10 text-amber-400 border-amber-500/20")}>
          {isComplete ? "COMPLETED" : isPending ? "PENDING" : "ANALYZING"}
        </span>
      </div>

      {isPending && (
        <p className="text-[11px] text-amber-500/80 flex items-center gap-1.5 mb-3">
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Analysis must be completed before viewing results
        </p>
      )}

      {isAnalyzing && (
        <p className="text-[11px] text-brand-400 flex items-center gap-1.5 mb-3 animate-pulse">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-400 animate-ping" />
          Analysing with GPT-4o…
        </p>
      )}

      {isComplete && (
        <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mb-3">
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>
          AI Analysis is ready and available.
        </p>
      )}

      <div className="flex items-center gap-2">
        <button type="button"
          onClick={(e) => { e.stopPropagation(); onAnalyze(doc); }}
          disabled={analyzing || isAnalyzing}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-dark-950 transition-colors flex-1 justify-center disabled:opacity-60">
          {isAnalyzing || analyzing
            ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-dark-950 border-t-transparent" />
            : <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          {isAnalyzing || analyzing ? "Analyzing…" : "Analyze"}
        </button>
        <button type="button" title="Preview"
          className={cn("p-2 rounded-xl border transition-colors",
            isComplete ? "border-dark-600 bg-dark-800 hover:bg-dark-700 text-dark-200" : "border-dark-700 bg-dark-900 text-dark-600 cursor-not-allowed opacity-40")}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button type="button" title="Download"
          className="p-2 rounded-xl border border-dark-600 bg-dark-800 hover:bg-dark-700 text-dark-200 transition-colors">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button type="button" title="Delete"
          className="p-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition-colors">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function AiAnalyzerPage() {
  const [selectedDoc, setSelectedDoc] = useState<AiDocument | null>(AI_DOCS.find((d) => d.analysisStatus === "completed") ?? null);
  const [activeTab,   setActiveTab]   = useState("Summary");
  const [question,    setQuestion]    = useState("");
  const [aiAnswer,    setAiAnswer]    = useState("");
  const [aiAnswering, setAiAnswering] = useState(false);
  const [aiSummary,   setAiSummary]   = useState<string>(selectedDoc?.aiSummary ?? "");
  const [analyzing,   setAnalyzing]   = useState(false);
  const [docs,        setDocs]        = useState<AiDocument[]>(AI_DOCS);

  // Analyze a document — calls the real AI summarizer
  const handleAnalyze = async (doc: AiDocument) => {
    if (analyzing) return;
    setAnalyzing(true);
    setSelectedDoc({ ...doc, analysisStatus: "analyzing" });
    try {
      const text = doc.aiSummary
        ? `Document: ${doc.name}\n\nExisting summary: ${doc.aiSummary}\n\nKeywords: ${doc.aiKeywords?.join(", ") ?? ""}`
        : `Document: ${doc.name}\nType: ${doc.mimeType}\nSize: ${formatBytes(doc.sizeBytes)}\nTags: ${doc.tags.join(", ") || "none"}`;

      const res = await summarizeText({
        text,
        strategy:      "abstractive",
        max_length:    200,
        bullet_points: true,
        model:         "gpt-4o",
      });

      const updated: AiDocument = {
        ...doc,
        analysisStatus: "completed",
        aiSummary:  res.summary,
        aiKeywords: res.keywords,
      };
      setDocs((prev) => prev.map((d) => d.id === doc.id ? updated : d));
      setSelectedDoc(updated);
      setAiSummary(res.summary);
    } catch (err: unknown) {
      setDocs((prev) => prev.map((d) => d.id === doc.id ? { ...d, analysisStatus: "failed" } : d));
      setSelectedDoc((prev) => prev ? { ...prev, analysisStatus: "failed" } : prev);
    } finally {
      setAnalyzing(false);
    }
  };

  // Ask AI a question about the selected document
  const handleAskAI = async () => {
    if (!question.trim() || aiAnswering || !selectedDoc) return;
    setAiAnswering(true);
    setAiAnswer("");
    try {
      const context = selectedDoc.aiSummary
        ? [selectedDoc.aiSummary, ...(selectedDoc.aiKeywords ?? [])]
        : [`Document: ${selectedDoc.name}`];

      const res = await applyReasoning({
        question: question.trim(),
        context,
        strategy: "chain_of_thought",
        model:    "gpt-4o",
      });
      setAiAnswer(res.final_answer);
    } catch {
      setAiAnswer("⚠️ AI service unavailable — start it with: uvicorn main:app --port 8001 --reload");
    } finally {
      setAiAnswering(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          {/* Top bar */}
          <div className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/[0.06] bg-dark-950/95 backdrop-blur-sm px-6 py-3">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input placeholder="Search documents…" className="w-full rounded-2xl border border-white/[0.08] bg-dark-800/60 py-2 pl-9 pr-4 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none transition" />
            </div>
            <Link href="/storage/upload"
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-sm font-bold text-dark-950 transition-colors ml-auto">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
            </Link>
          </div>

          <div className="px-6 py-6 space-y-8">
            {/* Welcome banner */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-600/80 via-brand-600/60 to-purple-800/70 p-7 relative overflow-hidden">
              <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-purple-900/30 to-transparent" />
              <h1 className="text-2xl font-extrabold text-white mb-1">Welcome back, Jaswant!</h1>
              <p className="text-purple-200/80 text-sm max-w-md">
                Your AI-powered document analysis platform is ready to help you extract insights from any document.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link href="/storage/upload"
                  className="flex items-center gap-2 rounded-xl bg-white hover:bg-gray-100 px-5 py-2.5 text-sm font-semibold text-dark-900 transition-colors shadow-lg">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload New Document
                </Link>
                <button type="button"
                  className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><path d="M18.4 2.6a.6.6 0 0 1 .6.6v3.4a.6.6 0 0 1-.6.6H15a.6.6 0 0 1-.6-.6V3.2a.6.6 0 0 1 .6-.6z"/></svg>
                  Try AI Analysis
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className={cn("rounded-2xl border p-5", s.color)}>
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-dark-400 font-medium leading-relaxed">{s.label}</p>
                    <span className="text-lg">{s.icon}</span>
                  </div>
                  <p className="text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="18 15 12 9 6 15"/></svg>
                    {s.trend}
                  </p>
                </div>
              ))}
            </div>

            {/* Your Documents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Your Documents</h2>
                  <p className="text-xs text-dark-400 mt-0.5">Upload and analyze documents with AI</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button"
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m15 3-4 9h9"/><path d="M3 20c0-4.4 3.6-8 8-8"/></svg>
                    Compare
                  </button>
                  <Link href="/storage/upload"
                    className="flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition-colors">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {docs.map((doc) => (
                  <DocCard
                    key={doc.id}
                    doc={doc}
                    selected={selectedDoc?.id === doc.id}
                    onSelect={() => setSelectedDoc(doc)}
                    onAnalyze={handleAnalyze}
                    analyzing={analyzing}
                  />
                ))}
              </div>
            </div>

            {/* Analysis panel */}
            {selectedDoc && selectedDoc.analysisStatus === "completed" && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left tab nav */}
                <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-2 h-fit">
                  <nav className="space-y-0.5">
                    {AI_TABS.map((tab) => (
                      <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                        className={cn(
                          "w-full flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-left font-medium transition-all",
                          activeTab === tab
                            ? "bg-amber-500/15 text-amber-400"
                            : "text-dark-300 hover:bg-white/5 hover:text-white"
                        )}>
                        <div className={cn("h-4 w-4 rounded-full border-2 shrink-0 transition-colors",
                          activeTab === tab ? "border-amber-400 bg-amber-400" : "border-dark-500 bg-transparent"
                        )} />
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Right content panel */}
                <div className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6 space-y-5">
                  {activeTab === "Summary" && (
                    <>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">Executive Summary</h3>
                        <p className="text-sm text-dark-200 leading-relaxed">
                          {selectedDoc.aiSummary ??
                            "This document provides a comprehensive technical overview including architecture design, implementation details, and performance benchmarks. The content covers advanced concepts relevant to modern AI systems."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                          <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            Key Points
                          </h4>
                          <ul className="space-y-2">
                            {[
                              "Strong skills in modern web development technologies.",
                              "Diverse work experience with measurable impacts.",
                              "Educational background in engineering.",
                              ...(selectedDoc.aiKeywords?.slice(0, 2).map((k) => `Contains insights on ${k}.`) ?? []),
                            ].map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-dark-200">
                                <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                          <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {[
                              "Use bullet points for clarity.",
                              "Quantify achievements to demonstrate impact.",
                              "Ensure all personal information is up-to-date and correctly formatted.",
                            ].map((rec, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-dark-200">
                                <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {selectedDoc.aiKeywords && selectedDoc.aiKeywords.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-dark-400 uppercase tracking-widest mb-2">AI Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedDoc.aiKeywords.map((kw) => (
                              <span key={kw} className="rounded-full bg-brand-500/15 border border-brand-500/20 text-brand-300 px-3 py-1 text-xs font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "Your Questions" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white">Ask AI About This Document</h3>
                      <div className="flex gap-3">
                        <input
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                          placeholder="Ask anything about this document…"
                          className="flex-1 rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none transition"
                          disabled={aiAnswering}
                        />
                        <button
                          type="button"
                          onClick={handleAskAI}
                          disabled={aiAnswering || !question.trim()}
                          className="rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {aiAnswering
                            ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Thinking…</>
                            : "Ask AI"
                          }
                        </button>
                      </div>
                      {aiAnswer ? (
                        <div className="rounded-xl bg-brand-500/5 border border-brand-500/20 p-4">
                          <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                            GPT-4o Answer (via NEXUS AI Service)
                          </p>
                          <p className="text-sm text-dark-100 leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-dark-800/60 border border-white/[0.06] p-4">
                          <p className="text-xs text-dark-400 italic">
                            Ask a question — GPT-4o will answer using the document context via the NEXUS AI Service at localhost:8001.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!["Summary", "Your Questions"].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <span className="text-4xl mb-3">🤖</span>
                      <h3 className="text-base font-semibold text-white">{activeTab} Analysis</h3>
                      <p className="text-sm text-dark-400 mt-2">Run AI analysis to generate {activeTab.toLowerCase()} insights for this document.</p>
                      <button type="button" className="mt-5 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-sm font-bold text-dark-950 transition-colors">
                        Generate {activeTab}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
