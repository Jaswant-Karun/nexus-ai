import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export function InputField({
  label,
  error,
  hint,
  icon,
  wrapperClassName,
  className,
  id,
  ...props
}: InputFieldProps) {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={fieldId} className="block text-xs font-medium text-dark-200">
          {label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
            {icon}
          </span>
        )}
        <input
          id={fieldId}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-400",
            "focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-9",
            error && "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-dark-400">{hint}</p>}
    </div>
  );
}
