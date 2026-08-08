import type { ReactNode } from "react";

interface DataTableProps {
  columns: string[];
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  minWidth?: string;
  skeletonRows?: number;
}

export function DataTable({
  columns,
  children,
  loading,
  empty,
  emptyMessage = "No results found.",
  minWidth = "720px",
  skeletonRows = 6,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] table-wrap">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
          <tr>
            {columns.map((col) => (
              <th key={col} scope="col" className="px-4 py-2.5 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, row) => (
              <tr key={row} aria-hidden>
                {columns.map((_, col) => (
                  <td key={col} className="px-4 py-3.5">
                    <div
                      className="skeleton skeleton--text"
                      style={{
                        width: `${55 + ((row + col) % 4) * 10}%`,
                        maxWidth: "100%",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : empty ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[var(--text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
      {loading ? <span className="sr-only">Loading table…</span> : null}
    </div>
  );
}
