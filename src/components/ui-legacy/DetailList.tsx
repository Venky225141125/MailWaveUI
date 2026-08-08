import type { ReactNode } from "react";

export function DetailList({ children }: { children: ReactNode }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>
  );
}

export function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--text)]">{children}</dd>
    </div>
  );
}
