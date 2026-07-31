import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({
  label,
  id,
  className = "",
  ...rest
}: TextareaProps) {
  const areaId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={areaId}
          className="text-sm font-medium text-[var(--text)]"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={areaId}
        className={`w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 font-mono text-sm text-[var(--text)] ${className}`}
        {...rest}
      />
    </div>
  );
}
