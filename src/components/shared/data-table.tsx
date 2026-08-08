import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTableProps {
  columns: string[];
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  minWidth?: string;
  skeletonRows?: number;
  className?: string;
}

export function DataTable({
  columns,
  children,
  loading,
  empty,
  emptyMessage = "No results found.",
  minWidth = "720px",
  skeletonRows = 6,
  className,
}: DataTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm",
        className
      )}
    >
      <Table style={{ minWidth }}>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/80 bg-muted/40">
            {columns.map((col) => (
              <TableHead
                key={col || "actions"}
                className={cn(
                  "h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground",
                  col === "" && "w-12 text-right"
                )}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, row) => (
              <TableRow key={row} className="hover:bg-transparent">
                {columns.map((_, col) => (
                  <TableCell key={col} className="px-4 py-3.5">
                    <Skeleton
                      className="h-3.5 rounded-md"
                      style={{
                        width: `${55 + ((row + col) % 4) * 10}%`,
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : empty ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-32 px-4 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            children
          )}
        </TableBody>
      </Table>
      {loading ? <span className="sr-only">Loading table…</span> : null}
    </div>
  );
}
