"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  pageSize?: number;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  pageSize = 10,
  emptyMessage = "No data available.",
  loading = false,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={cn("rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-300",
                    col.sortable && "cursor-pointer select-none hover:text-white transition-colors",
                    col.className
                  )}
                  onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                >
                  <span className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <span className="text-dark-500">
                        {sortKey === col.key
                          ? sortDir === "asc" ? "↑" : "↓"
                          : "↕"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-dark-300">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-dark-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((item, idx) => (
                <tr
                  key={keyExtractor(item, idx)}
                  className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] last:border-0"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn("px-5 py-3.5 text-dark-100", col.className)}>
                      {col.render
                        ? col.render(item, idx)
                        : String(item[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
          <p className="text-xs text-dark-400">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of{" "}
            {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <PaginationBtn disabled={page === 1} onClick={() => setPage(1)}>«</PaginationBtn>
            <PaginationBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</PaginationBtn>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <PaginationBtn key={p} active={p === page} onClick={() => setPage(p)}>
                  {p}
                </PaginationBtn>
              );
            })}
            <PaginationBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</PaginationBtn>
            <PaginationBtn disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</PaginationBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function PaginationBtn({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "text-dark-300 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}
