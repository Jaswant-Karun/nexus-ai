import Link from "next/link";
import { cn } from "@/lib/utils";

interface Crumb {
  id?: string;
  label: string;
  href?: string;
}

interface StorageBreadcrumbProps {
  crumbs: Crumb[];
  className?: string;
}

export function StorageBreadcrumb({ crumbs, className }: StorageBreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={crumb.id ?? crumb.label} className="flex items-center gap-1">
            {idx > 0 && (
              <svg className="text-dark-600 shrink-0" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
            {crumb.href && !isLast ? (
              <Link href={crumb.href} className="text-dark-300 hover:text-white transition-colors truncate max-w-[120px]">
                {crumb.label}
              </Link>
            ) : (
              <span className={cn("truncate max-w-[160px]", isLast ? "font-medium text-white" : "text-dark-300")}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
