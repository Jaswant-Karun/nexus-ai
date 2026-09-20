/**
 * Format a number with SI suffixes: 1200 → "1.2k", 1_500_000 → "1.5M"
 */
export function formatNumber(n: number, decimals = 1): string {
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(decimals)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(decimals)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(decimals)}k`;
  return String(n);
}

/**
 * Format bytes into a human-readable string: 1536 → "1.5 KB"
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format a date string or Date into a relative label: "2 min ago"
 */
export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60)  return "just now";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m} min ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h} hr${h > 1 ? "s" : ""} ago`;
  }
  const d = Math.floor(diff / 86400);
  if (d < 7) return `${d} day${d > 1 ? "s" : ""} ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Format a date string for display: "Jul 29, 2026"
 */
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString(undefined, opts ?? {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a number as a percentage: 0.974 → "97.4%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Truncate a string to maxLength with an ellipsis
 */
export function truncate(str: string, maxLength = 80): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

/**
 * Convert a snake_case or camelCase string to Title Case
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Format a cost in USD: 0.00512 → "$0.0051"
 */
export function formatUSD(amount: number): string {
  if (amount === 0) return "$0.00";
  if (Math.abs(amount) < 0.01) return `$${amount.toFixed(4)}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

/**
 * Format latency ms → "310 ms" or "> 1 s"
 */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}
