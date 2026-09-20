import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[] | string[];
  error?: string;
  hint?: string;
  placeholder?: string;
  wrapperClassName?: string;
}

export function SelectField({
  label,
  options,
  error,
  hint,
  placeholder,
  wrapperClassName,
  className,
  id,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const normalised: SelectOption[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={fieldId} className="block text-xs font-medium text-dark-200">
          {label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={fieldId}
          className={cn(
            "w-full appearance-none rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 pr-9 text-sm text-white",
            "focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/50",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalised.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m6 9 6 6 6-6" /></svg>
        </span>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-dark-400">{hint}</p>}
    </div>
  );
}
