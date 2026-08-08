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
    <div className="table-wrap overflow-x-auto rounded-xl border bg-card">
      <Table style={{ minWidth }}>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, row) => (
              <TableRow key={row}>
                {columns.map((_, col) => (
                  <TableCell key={col}>
                    <Skeleton
                      className="h-3.5"
                      style={{
                        width: `${55 + ((row + col) % 4) * 10}%`,
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : empty ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
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
