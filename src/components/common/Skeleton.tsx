import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden />;
}

export function StatsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      role="status"
      aria-label="Loading statistics"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="skeleton--tile" />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]"
      role="status"
      aria-label="Loading table"
    >
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={i}
              className="skeleton--text"
              style={{ width: `${60 + (i % 3) * 20}px` }}
            />
          ))}
        </div>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: columns }).map((_, col) => (
              <Skeleton
                key={col}
                className="skeleton--text flex-1"
                style={{ maxWidth: col === 0 ? "40%" : "20%" }}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading details">
      <div className="flex flex-col gap-2">
        <Skeleton className="skeleton--title" />
        <Skeleton className="skeleton--text" style={{ width: "12rem" }} />
      </div>
      <StatsGridSkeleton count={4} />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="skeleton--tile" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="skeleton--title" />
        <Skeleton className="skeleton--text" style={{ width: "18rem" }} />
      </div>
      <Skeleton style={{ height: "2.5rem", width: "8rem" }} />
    </div>
  );
}

export function DashboardSkeleton({ tiles = 6 }: { tiles?: number }) {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading dashboard">
      <PageHeaderSkeleton />
      <StatsGridSkeleton count={tiles} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function ListPageSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading list">
      <PageHeaderSkeleton />
      <TableSkeleton columns={columns} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
