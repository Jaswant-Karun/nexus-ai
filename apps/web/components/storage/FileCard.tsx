"use client";

import { cn } from "@/lib/utils";
import { formatBytes, relativeTime, CATEGORY_META } from "@/lib/storage";
import { FileIcon } from "./FileIcon";
import type { StorageFile } from "@/types/storage";

interface FileCardProps {
  file: StorageFile;
  view?: "grid" | "list";
  selected?: boolean;
  onSelect?: (id: string) => void;
  onOpen?: (file: StorageFile) => void;
  onStar?: (id: string) => void;
  onTrash?: (id: string) => void;
  className?: string;
}

export function FileCard({
  file,
  view = "grid",
  selected,
  onSelect,
  onOpen,
  onStar,
  onTrash,
  className,
}: FileCardProps) {
  const meta = CATEGORY_META[file.category];

  if (view === "list") {
    return (
      <div
        className={cn(
          "group flex items-center gap-4 rounded-xl border px-4 py-3 cursor-pointer transition-all",
          selected
            ? "border-brand-500/40 bg-brand-500/8"
            : "border-transparent hover:border-white/[0.06] hover:bg-dark-800/60",
          className
        )}
        onClick={() => onOpen?.(file)}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect?.(file.id)}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-white/20 bg-dark-700 accent-brand-500 cursor-pointer"
          aria-label={`Select ${file.name}`}
        />
        <FileIcon mimeType={file.mimeType} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{file.name}</p>
          <p className="text-xs text-dark-400">{meta.label}</p>
        </div>
        <span className="hidden sm:block text-xs text-dark-300 w-20 text-right">{formatBytes(file.sizeBytes)}</span>
        <span className="hidden md:block text-xs text-dark-400 w-24 text-right">{relativeTime(file.updatedAt)}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={(e) => { e.stopPropagation(); onStar?.(file.id); }}
            className={cn("p-1.5 rounded-lg hover:bg-white/10 transition-colors text-sm", file.isStarred ? "text-amber-400" : "text-dark-400")}>
            {file.isStarred ? "★" : "☆"}
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onTrash?.(file.id); }}
            className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-dark-400 transition-colors text-sm">
            🗑
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border p-4 cursor-pointer transition-all",
        selected
          ? "border-brand-500/40 bg-brand-500/8"
          : "border-white/[0.06] bg-dark-900/60 hover:border-brand-500/20 hover:bg-dark-800/60",
        className
      )}
      onClick={() => onOpen?.(file)}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect?.(file.id)}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 left-3 h-4 w-4 rounded border-white/20 bg-dark-700 accent-brand-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Select ${file.name}`}
      />
      <div className="flex items-start justify-between mb-3">
        <FileIcon mimeType={file.mimeType} size="md" />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onStar?.(file.id); }}
          className={cn("p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-sm", file.isStarred ? "opacity-100 text-amber-400" : "text-dark-400 hover:text-amber-400")}
        >
          {file.isStarred ? "★" : "☆"}
        </button>
      </div>
      <p className="text-sm font-medium text-white truncate mb-0.5">{file.name}</p>
      <p className="text-xs text-dark-400">{formatBytes(file.sizeBytes)}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold border", meta.bg, meta.color, "border-current/20")}>
          {meta.label}
        </span>
        <span className="text-[10px] text-dark-500">{relativeTime(file.updatedAt)}</span>
      </div>
    </div>
  );
}
