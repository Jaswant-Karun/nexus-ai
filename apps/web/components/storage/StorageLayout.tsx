import { StorageSidebar } from "./StorageSidebar";
import { cn } from "@/lib/utils";

interface StorageLayoutProps {
  children: React.ReactNode;
  /** Optional right-column panel (e.g. file detail / AI insights) */
  rightPanel?: React.ReactNode;
  className?: string;
}

export function StorageLayout({ children, rightPanel, className }: StorageLayoutProps) {
  return (
    <div className={cn("flex h-full flex-1 min-h-0 overflow-hidden", className)}>
      <StorageSidebar />
      <main className="flex-1 overflow-y-auto bg-dark-950/70">
        {children}
      </main>
      {rightPanel && (
        <aside className="w-72 shrink-0 border-l border-white/[0.06] bg-dark-900/80 overflow-y-auto">
          {rightPanel}
        </aside>
      )}
    </div>
  );
}
