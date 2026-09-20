import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export function TextArea({
  label,
  error,
  hint,
  wrapperClassName,
  className,
  id,
  rows = 4,
  ...props
}: TextAreaProps) {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={fieldId} className="block text-xs font-medium text-dark-200">
          {label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <textarea
        id={fieldId}
        rows={rows}
        className={cn(
          "w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-400 resize-y",
          "focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-dark-400">{hint}</p>}
    </div>
  );
}
