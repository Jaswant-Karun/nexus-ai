/**
 * Global loading UI — shown by Next.js App Router automatically
 * while any page segment is loading. Keeps the sidebar visible
 * and shows a pulse skeleton so users see instant feedback.
 */
export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar skeleton */}
      <div className="h-14 border-b border-white/[0.06] bg-dark-950/90 flex items-center px-5 gap-3">
        <div className="h-7 w-7 rounded-lg bg-brand-600/30 animate-pulse" />
        <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
        <div className="ml-auto h-7 w-7 rounded-full bg-white/10 animate-pulse" />
        <div className="h-7 w-28 rounded-xl bg-white/5 animate-pulse" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="w-60 border-r border-white/[0.06] bg-dark-900/80 px-2 py-3 space-y-1 shrink-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}
              className="h-10 rounded-xl bg-white/[0.04] animate-pulse"
              style={{ opacity: 1 - i * 0.04 }}
            />
          ))}
        </div>

        {/* Page content skeleton */}
        <div className="flex-1 p-8 space-y-6">
          {/* Page title */}
          <div className="space-y-2">
            <div className="h-8 w-72 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-4 w-48 rounded-lg bg-white/5 animate-pulse" />
          </div>

          {/* KPI cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 space-y-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="h-5 w-5 rounded bg-white/10" />
                </div>
                <div className="h-8 w-20 rounded-lg bg-white/15" />
                <div className="h-3 w-32 rounded bg-white/5" />
              </div>
            ))}
          </div>

          {/* Content block */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 space-y-3 animate-pulse">
            <div className="h-5 w-48 rounded-lg bg-white/10" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-white/[0.04] last:border-0">
                <div className="h-8 w-8 rounded-lg bg-white/[0.06]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-48 rounded bg-white/10" />
                  <div className="h-2.5 w-32 rounded bg-white/5" />
                </div>
                <div className="h-5 w-16 rounded-full bg-white/[0.06]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
