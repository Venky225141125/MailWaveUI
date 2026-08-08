import type { UploadBatchSummary } from "@/types";
import Link from "next/link";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime, formatNumber } from "@/lib/helpers";

interface UploadBatchTableProps {
  batches: UploadBatchSummary[];
  loading?: boolean;
  hrefForBatch?: (batch: UploadBatchSummary) => string;
  emptyMessage?: string;
}

export function UploadBatchTable({
  batches,
  loading,
  hrefForBatch,
  emptyMessage = "No uploads yet.",
}: UploadBatchTableProps) {
  return (
    <DataTable
      columns={[
        "File",
        "Status",
        "Total",
        "Valid",
        "Invalid",
        "Soft",
        "Hard",
        "Uploaded",
      ]}
      loading={loading}
      empty={!loading && batches.length === 0}
      emptyMessage={emptyMessage}
      minWidth="880px"
    >
      {batches.map((batch) => (
        <TableRow key={batch.id}>
          <TableCell className="px-4 py-3.5 font-medium">
            {hrefForBatch ? (
              <Link
                href={hrefForBatch(batch)}
                className="text-primary hover:underline"
              >
                {batch.originalFilename}
              </Link>
            ) : (
              batch.originalFilename
            )}
          </TableCell>
          <TableCell className="px-4 py-3.5">
            <StatusBadge status={batch.status} />
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(batch.totalRecords)}
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(batch.validCount)}
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(batch.invalidCount)}
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(batch.softBounceCount)}
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(batch.hardBounceCount)}
          </TableCell>
          <TableCell className="px-4 py-3.5 text-muted-foreground">
            {formatDateTime(batch.uploadedAt)}
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
}
