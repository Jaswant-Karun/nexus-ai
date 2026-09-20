import { cn } from "@/lib/utils";
import { getMimeCategory, CATEGORY_META } from "@/lib/storage";

interface FileIconProps {
  mimeType: string;
  fileName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-xl",
  lg: "h-14 w-14 text-3xl",
  xl: "h-20 w-20 text-5xl",
};

export function FileIcon({ mimeType, size = "md", className }: FileIconProps) {
  const category = getMimeCategory(mimeType);
  const meta = CATEGORY_META[category];
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl shrink-0",
        meta.bg,
        sizeMap[size],
        className
      )}
    >
      <span role="img" aria-label={meta.label}>{meta.icon}</span>
    </div>
  );
}
