import type { ReactNode } from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = "Back",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-1.5 inline-block text-xs font-medium text-[var(--brand)] hover:underline sm:text-sm"
          >
            ← {backLabel}
          </Link>
        ) : null}
        <h1 className="text-lg font-semibold tracking-tight text-[var(--text)] sm:text-xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-xs text-[var(--text-muted)] sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 flex-wrap gap-2">{action}</div>
      ) : null}
    </div>
  );
}
