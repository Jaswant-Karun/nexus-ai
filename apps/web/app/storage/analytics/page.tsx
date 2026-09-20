"use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { formatBytes, MOCK_FILES } from "@/lib/storage";
import { cn } from "@/lib/utils";

const DAILY = [
  { day: "Mon", uploads: 12, downloads: 34 }, { day: "Tue", uploads: 8,  downloads: 21 },
  { day: "Wed", uploads: 21, downloads: 48 }, { day: "Thu", uploads: 15, downloads: 39 },
  { day: "Fri", uploads: 19, downloads: 52 }, { day: "Sat", uploads: 5,  downloads: 14 },
  { day: "Sun", uploads: 3,  downloads: 8  },
];
const maxUploads   = Math.max(...DAILY.map((d) => d.uploads));
const maxDownloads = Math.max(...DAILY.map((d) => d.downloads));

const topFiles = [...MOCK_FILES].filter((f) => !f.isTrashed).sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5);

export default function StorageAnalyticsPage() {
  const totalSize = MOCK_FILES.filter((f) => !f.isTrashed).reduce((a, f) => a + f.sizeBytes, 0);

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Storage Analytics</h1>
            <p className="mt-1 text-sm text-dark-300">Usage charts, top files, storage growth, and download trends.</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Files",    value: MOCK_FILES.filter((f) => !f.isTrashed).length, icon: "📄", accent: "brand" },
              { label: "Total Size",     value: formatBytes(totalSize), icon: "☁️", accent: "purple" },
              { label: "Downloads (mo)", value: "238", icon: "⬇️", accent: "cyan" },
              { label: "AI Jobs Done",   value: "391", icon: "🤖", accent: "amber" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Upload/Download chart */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
            <h2 className="text-base font-semibold text-white mb-5">Weekly Activity</h2>
            <div className="flex items-end gap-3 h-40">
              {DAILY.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end h-32">
                    <div className="flex-1 rounded-t-md bg-brand-500 transition-all" style={{ height: `${(d.uploads / maxUploads) * 100}%` }} title={`Uploads: ${d.uploads}`} />
                    <div className="flex-1 rounded-t-md bg-purple-500/60 transition-all" style={{ height: `${(d.downloads / maxDownloads) * 100}%` }} title={`Downloads: ${d.downloads}`} />
                  </div>
                  <span className="text-[10px] text-dark-400">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-dark-400">
              <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-brand-500 inline-block" /> Uploads</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-purple-500/60 inline-block" /> Downloads</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category breakdown */}
            <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Storage by Category</h2>
              <div className="space-y-3">
                {[
                  { label: "Documents",     pct: 38, bytes: totalSize * 0.38, color: "bg-blue-500" },
                  { label: "Images",        pct: 29, bytes: totalSize * 0.29, color: "bg-emerald-500" },
                  { label: "Videos",        pct: 18, bytes: totalSize * 0.18, color: "bg-purple-500" },
                  { label: "Audio",         pct: 8,  bytes: totalSize * 0.08, color: "bg-amber-500" },
                  { label: "Other",         pct: 7,  bytes: totalSize * 0.07, color: "bg-dark-500" },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-dark-200">{c.label}</span>
                      <span className="text-dark-400">{c.pct}% · {formatBytes(c.bytes)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-dark-700">
                      <div className={cn("h-full rounded-full", c.color)} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top downloaded files */}
            <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Most Downloaded</h2>
              <div className="space-y-3">
                {topFiles.map((f, idx) => (
                  <div key={f.id} className="flex items-center gap-3">
                    <span className="text-dark-500 text-sm font-mono w-4 shrink-0">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{f.name}</p>
                      <div className="h-1 mt-1 w-full rounded-full bg-dark-700">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${(f.downloadCount / topFiles[0].downloadCount) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-dark-300 shrink-0">{f.downloadCount}</span>
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
