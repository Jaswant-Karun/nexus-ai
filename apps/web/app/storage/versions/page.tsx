"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { FileIcon } from "@/components/storage/FileIcon";
import { formatBytes } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface Version {
  id:            string;
  fileId:        string;
  fileName:      string;
  mimeType:      string;
  versionNumber: number;
  sizeBytes:     number;
  changeNote?:   string;
  createdBy:     string;
  createdAt:     string;
}

export default function VersionsPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/storage/versions")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: Version[] }) => {
        if (d.success && d.data) setVersions(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group by fileId
  const grouped = versions.reduce<Record<string, Version[]>>((acc, v) => {
    (acc[v.fileId] ??= []).push(v);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Version History</h1>
            <p className="mt-1 text-sm text-dark-300">View and restore previous versions of your files.</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 h-32 animate-pulse" />
              ))}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-dark-900/30 py-20 text-center">
              <span className="text-4xl mb-3">🕒</span>
              <p className="text-white font-semibold">No version history yet</p>
              <p className="text-dark-400 text-sm mt-1">Versions are created automatically when files are updated.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([fileId, fileVersions]) => {
              const first = fileVersions[0];
              return (
                <div key={fileId} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.06] bg-dark-800/40">
                    <FileIcon mimeType={first.mimeType} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-white">{first.fileName}</p>
                      <p className="text-xs text-dark-400">{fileVersions.length} version{fileVersions.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {fileVersions.map((v, idx) => {
                      const isCurrent = idx === 0;
                      return (
                        <div key={v.id} className="flex items-start gap-5 px-5 py-4">
                          <div className="flex flex-col items-center pt-1 shrink-0">
                            <div className={cn("h-3 w-3 rounded-full border-2",
                              isCurrent ? "bg-brand-500 border-brand-500" : "bg-dark-700 border-dark-500")} />
                            {idx < fileVersions.length - 1 && <div className="w-px flex-1 bg-dark-700 mt-1 h-8" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-semibold text-white">Version {v.versionNumber}</p>
                              {isCurrent && (
                                <span className="rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/20 px-2 py-0.5 text-[10px] font-bold">
                                  CURRENT
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-dark-300">{v.changeNote ?? "—"}</p>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-dark-500">
                              <span>{v.createdBy}</span>
                              <span>·</span>
                              <span>{new Date(v.createdAt).toLocaleString()}</span>
                              <span>·</span>
                              <span>{formatBytes(v.sizeBytes)}</span>
                            </div>
                          </div>
                          {!isCurrent && (
                            <button type="button"
                              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors shrink-0">
                              Restore
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </StorageLayout>
      </div>
    </div>
  );
}
