import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizeMap = {
  xs: "h-3 w-3 border",
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function LoadingSpinner({ size = "md", label, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-brand-500 border-t-transparent",
          sizeMap[size]
        )}
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && <p className="text-sm text-dark-300 animate-pulse">{label}</p>}
    </div>
  );
}
