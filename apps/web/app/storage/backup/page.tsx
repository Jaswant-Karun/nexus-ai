"use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { formatBytes } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { BackupRecord } from "@/types/storage";

const BACKUPS: BackupRecord[] = [
  { id: "b1", type: "daily",   status: "completed", fileCount: 482, sizeBytes: 284_000_000, createdAt: "2026-07-30T02:00:00Z", completedAt: "2026-07-30T02:08:21Z" },
  { id: "b2", type: "daily",   status: "completed", fileCount: 479, sizeBytes: 282_000_000, createdAt: "2026-07-29T02:00:00Z", completedAt: "2026-07-29T02:07:44Z" },
  { id: "b3", type: "weekly",  status: "completed", fileCount: 470, sizeBytes: 276_000_000, createdAt: "2026-07-27T03:00:00Z", completedAt: "2026-07-27T03:14:02Z" },
  { id: "b4", type: "daily",   status: "failed",    fileCount: 0,   sizeBytes: 0,           createdAt: "2026-07-28T02:00:00Z", completedAt: undefined },
  { id: "b5", type: "monthly", status: "completed", fileCount: 431, sizeBytes: 245_000_000, createdAt: "2026-07-01T04:00:00Z", completedAt: "2026-07-01T04:22:17Z" },
  { id: "b6", type: "manual",  status: "completed", fileCount: 455, sizeBytes: 261_000_000, createdAt: "2026-07-15T11:30:00Z", completedAt: "2026-07-15T11:39:45Z" },
];

const TYPE_BADGE: Record<BackupRecord["type"], string> = {
  daily:   "bg-brand-500/10 text-brand-400 border-brand-500/20",
  weekly:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  monthly: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  manual:  "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const STATUS_BADGE: Record<BackupRecord["status"], string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed:    "bg-red-500/10 text-red-400 border-red-500/20",
  running:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function BackupPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Backup & Restore</h1>
              <p className="mt-1 text-sm text-dark-300">Automatic daily, weekly, and monthly backups with one-click restore.</p>
            </div>
            <button type="button" className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all">
              💾 Run Backup Now
            </button>
          </div>

          {/* Schedule cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { type: "Daily",   icon: "📅", time: "2:00 AM UTC",   retention: "30 days",   status: "Active" },
              { type: "Weekly",  icon: "📆", time: "Sunday 3:00 AM", retention: "12 weeks",  status: "Active" },
              { type: "Monthly", icon: "🗓️", time: "1st at 4:00 AM", retention: "12 months", status: "Active" },
            ].map((s) => (
              <div key={s.type} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="text-sm font-semibold text-white">{s.type} Backup</p>
                  <span className="ml-auto rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-dark-300">Runs {s.time}</p>
                <p className="text-xs text-dark-400 mt-0.5">Retention: {s.retention}</p>
              </div>
            ))}
          </div>

          {/* Backup history */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
            <div className="grid grid-cols-[120px_1fr_80px_80px_120px_auto] gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-dark-400">
              <span>Type</span><span>Date</span><span>Files</span><span>Size</span><span>Status</span><span>Action</span>
            </div>
            {BACKUPS.map((b) => (
              <div key={b.id} className="grid grid-cols-[120px_1fr_80px_80px_120px_auto] items-center gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-dark-800/30 transition-colors">
                <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize w-fit", TYPE_BADGE[b.type])}>
                  {b.type}
                </span>
                <div>
                  <p className="text-sm text-white">{new Date(b.createdAt).toLocaleString()}</p>
                  {b.completedAt && (
                    <p className="text-[10px] text-dark-500">
                      Completed in {Math.round((new Date(b.completedAt).getTime() - new Date(b.createdAt).getTime()) / 1000 / 60)} min
                    </p>
                  )}
                </div>
                <span className="text-sm text-dark-200">{b.fileCount}</span>
                <span className="text-sm text-dark-200">{b.sizeBytes ? formatBytes(b.sizeBytes) : "—"}</span>
                <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize w-fit", STATUS_BADGE[b.status])}>
                  {b.status}
                </span>
                {b.status === "completed" ? (
                  <button type="button" className="rounded-lg border border-brand-500/20 bg-brand-500/10 hover:bg-brand-500/20 px-3 py-1.5 text-xs font-medium text-brand-400 transition-colors">
                    Restore
                  </button>
                ) : (
                  <span className="text-xs text-dark-500">—</span>
                )}
              </div>
            ))}
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
