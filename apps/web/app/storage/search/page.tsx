"use client";

import { useState, useMemo } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { FileCard } from "@/components/storage/FileCard";
import { StorageEmptyState } from "@/components/storage/StorageEmptyState";
import { MOCK_FILES, CATEGORY_META } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { FileCategory } from "@/types/storage";

const CATEGORIES = Object.keys(CATEGORY_META) as FileCategory[];

export default function SearchPage() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState<FileCategory | "all">("all");
  const [mode,     setMode]     = useState<"keyword" | "semantic">("keyword");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched && !query) return [];
    return MOCK_FILES.filter((f) => {
      if (f.isTrashed) return false;
      if (category !== "all" && f.category !== category) return false;
      const q = query.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        (f.aiSummary?.toLowerCase().includes(q) ?? false) ||
        f.aiKeywords?.some((k) => k.toLowerCase().includes(q)) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, category, searched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Search Files</h1>
            <p className="mt-1 text-sm text-dark-300">Search by filename, AI-extracted content, keywords, and summaries.</p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg">🔍</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, content, keywords…"
                  className="w-full rounded-2xl border border-white/10 bg-dark-800/80 pl-11 pr-4 py-3.5 text-base text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
                />
              </div>
              <button type="submit"
                className="rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all">
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Mode toggle */}
              <div className="flex rounded-xl border border-white/10 bg-dark-800/80 p-0.5">
                {(["keyword", "semantic"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setMode(m)}
                    className={cn("rounded-lg px-4 py-1.5 text-xs font-medium capitalize transition-colors", mode === m ? "bg-brand-600 text-white" : "text-dark-300 hover:text-white")}>
                    {m === "semantic" ? "🧠 Semantic" : "🔤 Keyword"}
                  </button>
                ))}
              </div>
              {/* Category filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["all", ...CATEGORIES] as const).map((c) => (
                  <button key={c} type="button" onClick={() => setCategory(c)}
                    className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize", category === c ? "bg-brand-600 text-white" : "border border-white/10 text-dark-300 hover:text-white")}>
                    {c === "all" ? "All Types" : CATEGORY_META[c as FileCategory].icon + " " + CATEGORY_META[c as FileCategory].label}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Results */}
          {searched && query && (
            <div>
              <p className="text-sm text-dark-300 mb-4">
                {results.length === 0 ? "No results found" : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
              </p>
              {results.length === 0 ? (
                <StorageEmptyState icon="🔍" title="No files found"
                  description={mode === "semantic" ? "Try semantic search which searches AI-extracted content too" : "Try a different keyword or switch to semantic search"} />
              ) : (
                <div className="space-y-2">
                  {results.map((f) => (
                    <FileCard key={f.id} file={f} view="list" onOpen={(file) => window.location.href = `/storage/file/${file.id}`} />
                  ))}
                </div>
              )}
            </div>
          )}

          {!searched && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {[
                { icon: "📄", label: "Search inside PDFs", desc: "AI extracts and indexes full text" },
                { icon: "🧠", label: "Semantic understanding", desc: "Find files by meaning, not just words" },
                { icon: "🏷️", label: "Tag & keyword search", desc: "Search AI-generated keywords and tags" },
              ].map((tip) => (
                <div key={tip.label} className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
                  <span className="text-2xl mt-0.5">{tip.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{tip.label}</p>
                    <p className="text-xs text-dark-300 mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </StorageLayout>
      </div>
    </div>
  );
}
