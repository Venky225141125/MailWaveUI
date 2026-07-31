import type { UploadBatchSummary } from "@/types";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime, formatNumber } from "@/lib/utils";

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
        <tr key={batch.id} className="hover:bg-[var(--surface-muted)]">
          <td className="px-4 py-2.5 font-medium text-[var(--text)]">
            {hrefForBatch ? (
              <Link
                href={hrefForBatch(batch)}
                className="text-[var(--brand)] hover:underline"
              >
                {batch.originalFilename}
              </Link>
            ) : (
              batch.originalFilename
            )}
          </td>
          <td className="px-4 py-2.5">
            <StatusBadge status={batch.status} />
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(batch.totalRecords)}
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(batch.validCount)}
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(batch.invalidCount)}
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(batch.softBounceCount)}
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(batch.hardBounceCount)}
          </td>
          <td className="px-4 py-2.5 text-[var(--text-muted)]">
            {formatDateTime(batch.uploadedAt)}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
