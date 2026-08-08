import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string | null;
  /** Visual density — use compact on dense forms like registration. */
  density?: "compact" | "default";
}

export function Input({
  label,
  hint,
  error,
  density = "default",
  id,
  className = "",
  ...rest
}: InputProps) {
  const inputId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const compact = density === "compact";

  return (
    <div className={`flex flex-col ${compact ? "gap-0.5" : "gap-1"}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className={`font-medium text-[var(--text)] ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {label}
          {rest.required ? (
            <span className="ml-0.5 text-red-600" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`w-full rounded-[var(--radius-sm)] border bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors ${
          compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
        } ${
          error
            ? "border-red-400 focus:border-red-500 dark:border-red-500"
            : "border-[var(--border-strong)]"
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p
          id={errorId}
          role="alert"
          className={`font-medium text-red-600 dark:text-red-400 ${
            compact ? "text-[11px] leading-tight" : "text-xs"
          }`}
        >
          {error}
        </p>
      ) : hint ? (
        <p
          className={`text-[var(--text-muted)] ${
            compact ? "text-[11px] leading-tight" : "text-xs"
          }`}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
