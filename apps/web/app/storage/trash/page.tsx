"use client";

import { useState } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { FileIcon } from "@/components/storage/FileIcon";
import { StorageEmptyState } from "@/components/storage/StorageEmptyState";
import { formatBytes, MOCK_FILES, relativeTime } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function TrashPage() {
  const [trashed, setTrashed] = useState(MOCK_FILES.filter((f) => f.isTrashed));
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });

  const restore = (ids: string[]) => setTrashed((prev) => prev.filter((f) => !ids.includes(f.id)));
  const deletePermanent = (ids: string[]) => setTrashed((prev) => prev.filter((f) => !ids.includes(f.id)));

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Trash Bin</h1>
              <p className="mt-1 text-sm text-dark-300">Files are permanently deleted after 30 days. Restore them any time before that.</p>
            </div>
            {trashed.length > 0 && (
              <button type="button" onClick={() => deletePermanent(trashed.map((f) => f.id))}
                className="rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors">
                🗑 Empty Trash
              </button>
            )}
          </div>

          {selected.size > 0 && (
            <div className="flex items-center gap-3 rounded-xl bg-brand-500/10 border border-brand-500/20 px-4 py-3">
              <span className="text-sm text-brand-400 font-medium">{selected.size} selected</span>
              <button type="button" onClick={() => { restore([...selected]); setSelected(new Set()); }}
                className="rounded-lg bg-brand-600 hover:bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors">
                Restore
              </button>
              <button type="button" onClick={() => { deletePermanent([...selected]); setSelected(new Set()); }}
                className="rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors">
                Delete Permanently
              </button>
            </div>
          )}

          {trashed.length === 0 ? (
            <StorageEmptyState icon="🗑️" title="Trash is empty" description="Deleted files will appear here. They are kept for 30 days before permanent deletion." />
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden divide-y divide-white/[0.04]">
              {trashed.map((f) => (
                <div key={f.id} className={cn("flex items-center gap-4 px-5 py-4 transition-colors hover:bg-dark-800/40", selected.has(f.id) && "bg-brand-500/5")}>
                  <input type="checkbox" checked={selected.has(f.id)} onChange={() => toggle(f.id)}
                    className="h-4 w-4 rounded border-white/20 bg-dark-700 accent-brand-500 cursor-pointer" />
                  <FileIcon mimeType={f.mimeType} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{f.name}</p>
                    <p className="text-xs text-dark-400 mt-0.5">
                      Deleted {f.trashedAt ? relativeTime(f.trashedAt) : "recently"} · {formatBytes(f.sizeBytes)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => restore([f.id])}
                      className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors">
                      Restore
                    </button>
                    <button type="button" onClick={() => deletePermanent([f.id])}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors">
                      Delete
                    </button>
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
