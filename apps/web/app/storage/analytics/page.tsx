"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { formatBytes } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface TopFile { id: string; name: string; downloadCount: number; }
interface StorageAnalyticsData {
  totalFiles:   number;
  totalSize:    number;
  storageFiles: number;
  aiJobs:       number;
  recentFiles:  TopFile[];
}

export default function StorageAnalyticsPage() {
  const [data,    setData]    = useState<StorageAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use existing dashboard/stats + storage/files endpoints
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()),
      fetch("/api/storage/files?pageSize=5").then((r) => r.json()),
    ])
      .then(([stats, files]) => {
        const s  = (stats as { success: boolean; data?: { storageFiles: number; storageSizeGB: number; aiJobsDone: number } }).data;
        const fs = (files as { success: boolean; data?: TopFile[]; total?: number }).data ?? [];
        if (s) {
          setData({
            totalFiles:   s.storageFiles,
            totalSize:    s.storageSizeGB * 1e9,
            storageFiles: s.storageFiles,
            aiJobs:       s.aiJobsDone,
            recentFiles:  fs,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Storage Analytics</h1>
            <p className="mt-1 text-sm text-dark-300">Live file counts, sizes, and AI processing stats from your database.</p>
          </div>

          {/* KPIs — real data */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 h-20 animate-pulse" />
              ))}
            </div>
          ) : data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Files",  value: data.totalFiles,                icon: "📄" },
                { label: "Total Size",   value: formatBytes(data.totalSize),     icon: "☁️" },
                { label: "AI Jobs Done", value: data.aiJobs,                    icon: "🤖" },
                { label: "Processed",   value: `${data.totalFiles > 0 ? Math.round((data.aiJobs / (data.totalFiles || 1)) * 100) : 0}%`, icon: "✅" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
                  <div className="flex items-center justify-between mb-2"><span className="text-xl">{s.icon}</span></div>
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recent files */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Recent Files</h2>
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-dark-800/40 rounded-xl" />
                ))}
              </div>
            ) : !data?.recentFiles.length ? (
              <p className="text-xs text-dark-400">No files uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {data.recentFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between text-sm px-3 py-2.5 rounded-xl bg-dark-800/50">
                    <span className="text-white truncate max-w-xs">{f.name}</span>
                    <span className="text-dark-400 text-xs">{f.downloadCount} downloads</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
            <p className="text-xs text-brand-300">
              💡 Detailed analytics charts (uploads/downloads per day, category breakdown) will appear once more data is collected. Currently showing live counts from PostgreSQL.
            </p>
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
