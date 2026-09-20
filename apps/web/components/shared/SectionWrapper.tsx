import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function SectionWrapper({
  title,
  description,
  actions,
  children,
  className,
  innerClassName,
}: SectionWrapperProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-dark-300">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={innerClassName}>{children}</div>
    </section>
  );
}
