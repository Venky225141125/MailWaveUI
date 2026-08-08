"use client";

import type { EmailRecordResponse, Page } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { Select } from "@/components/shared/select";
import { CopyableText } from "@/components/shared/copyable-text";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/common/Pagination";
import { TableCell, TableRow } from "@/components/ui/table";
import { EMAIL_RECORD_STATUS_OPTIONS } from "@/constants/upload.constants";
import { formatDateTime } from "@/lib/helpers";

interface EmailRecordsPanelProps {
  records: Page<EmailRecordResponse> | null;
  loading: boolean;
  status: string;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
}

export function EmailRecordsPanel({
  records,
  loading,
  status,
  onStatusChange,
  onPageChange,
}: EmailRecordsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="Filter by status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {EMAIL_RECORD_STATUS_OPTIONS.map((opt) => (
            <option key={opt || "all"} value={opt}>
              {opt === "" ? "All" : opt.replaceAll("_", " ")}
            </option>
          ))}
        </Select>
      </div>

      <DataTable
        columns={["Email", "Status", "Invalid Reason", "Validated At"]}
        loading={loading}
        empty={!loading && (!records || records.content.length === 0)}
        emptyMessage="No records found."
      >
        {(records?.content ?? []).map((record) => (
          <TableRow key={record.id}>
            <TableCell className="px-4 py-3.5 font-medium">
              <CopyableText value={record.email} />
            </TableCell>
            <TableCell className="px-4 py-3.5">
              <StatusBadge status={record.status} />
            </TableCell>
            <TableCell className="px-4 py-3.5 text-muted-foreground">
              {record.invalidReason ?? "—"}
            </TableCell>
            <TableCell className="px-4 py-3.5 text-muted-foreground">
              {formatDateTime(record.validatedAt)}
            </TableCell>
          </TableRow>
        ))}
      </DataTable>

      {records ? (
        <Pagination
          page={records.page}
          totalPages={records.totalPages}
          onChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
