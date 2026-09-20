import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5", className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            {idx > 0 && (
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-dark-500">
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-sm text-dark-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn("text-sm", isLast ? "font-medium text-white" : "text-dark-300")}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
