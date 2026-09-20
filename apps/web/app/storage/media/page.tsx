"use client";

import { useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { formatBytes, relativeTime, MOCK_FILES } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { StorageFile } from "@/types/storage";

type MediaTab = "images" | "videos" | "audio";

const MEDIA_CATEGORIES: Record<MediaTab, string> = {
  images: "image",
  videos: "video",
  audio:  "audio",
};

export default function MediaViewerPage() {
  const [tab, setTab]         = useState<MediaTab>("images");
  const [selected, setSelected] = useState<StorageFile | null>(null);

  const items = MOCK_FILES.filter((f) => !f.isTrashed && f.category === MEDIA_CATEGORIES[tab]);

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Media Viewer</h1>
            <p className="mt-1 text-sm text-dark-300">Browse images, videos, and audio files with rich previews and AI insights.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl bg-dark-800/80 border border-white/[0.06] p-1 w-fit">
            {(Object.keys(MEDIA_CATEGORIES) as MediaTab[]).map((t) => (
              <button key={t} type="button" onClick={() => { setTab(t); setSelected(null); }}
                className={cn("flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-medium capitalize transition-all",
                  tab === t ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30" : "text-dark-300 hover:text-white")}>
                {t === "images" ? "🖼️" : t === "videos" ? "🎬" : "🎵"} {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Grid */}
            <div className="lg:col-span-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
                  <span className="text-4xl mb-3">{tab === "images" ? "🖼️" : tab === "videos" ? "🎬" : "🎵"}</span>
                  <p className="text-white font-semibold">No {tab} yet</p>
                  <p className="text-sm text-dark-300 mt-1">Upload some {tab} to see them here</p>
                </div>
              ) : (
                <div className={cn(tab === "audio" ? "space-y-2" : "grid grid-cols-2 sm:grid-cols-3 gap-4")}>
                  {items.map((item) => (
                    tab === "audio" ? (
                      <button key={item.id} type="button" onClick={() => setSelected(item)}
                        className={cn("flex items-center gap-4 w-full rounded-xl border p-4 text-left transition-all", selected?.id === item.id ? "border-brand-500/40 bg-brand-500/8" : "border-white/[0.06] bg-dark-900/60 hover:border-brand-500/20")}>
                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl">🎵</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs text-dark-400">{formatBytes(item.sizeBytes)} · {relativeTime(item.updatedAt)}</p>
                        </div>
                        <span className="text-brand-400 text-xl">▶</span>
                      </button>
                    ) : (
                      <button key={item.id} type="button" onClick={() => setSelected(item)}
                        className={cn("group relative aspect-square rounded-2xl border overflow-hidden transition-all",
                          selected?.id === item.id ? "border-brand-500/60" : "border-white/[0.06] hover:border-brand-500/30")}>
                        <div className={cn("h-full w-full flex items-center justify-center", tab === "videos" ? "bg-purple-500/10" : "bg-emerald-500/10")}>
                          <span className="text-5xl">{tab === "videos" ? "🎬" : "🖼️"}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          <span className="text-white text-sm font-medium text-center px-2 truncate w-full">{item.name}</span>
                          <span className="text-dark-300 text-xs">{formatBytes(item.sizeBytes)}</span>
                        </div>
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Preview panel */}
            <div>
              {selected ? (
                <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 space-y-4 sticky top-6">
                  <div className={cn("aspect-video rounded-xl flex items-center justify-center",
                    selected.category === "video" ? "bg-purple-500/10" :
                    selected.category === "audio" ? "bg-amber-500/10" : "bg-emerald-500/10")}>
                    <span className="text-6xl">
                      {selected.category === "video" ? "🎬" : selected.category === "audio" ? "🎵" : "🖼️"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{selected.name}</p>
                    <p className="text-xs text-dark-400 mt-1">{formatBytes(selected.sizeBytes)} · {relativeTime(selected.updatedAt)}</p>
                  </div>
                  <dl className="space-y-2">
                    {[
                      ["Type", selected.mimeType],
                      ["Downloads", String(selected.downloadCount)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <dt className="text-dark-400">{k}</dt>
                        <dd className="text-white font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <a href={selected.storageUrl}
                    className="block w-full rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2.5 text-sm font-medium text-white text-center transition-colors">
                    ⬇️ Download
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
                  <span className="text-3xl mb-2">👆</span>
                  <p className="text-sm text-dark-300">Click a file to preview</p>
                </div>
              )}
            </div>
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
