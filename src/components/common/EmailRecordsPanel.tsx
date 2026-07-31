"use client";

import type { EmailRecordResponse, Page } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/common/Pagination";
import { EMAIL_RECORD_STATUS_OPTIONS } from "@/constants/upload.constants";
import { formatDateTime } from "@/lib/utils";

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
          <tr key={record.id}>
            <td className="px-4 py-2.5 font-medium text-[var(--text)]">
              {record.email}
            </td>
            <td className="px-4 py-2.5">
              <StatusBadge status={record.status} />
            </td>
            <td className="px-4 py-2.5 text-[var(--text-muted)]">
              {record.invalidReason ?? "—"}
            </td>
            <td className="px-4 py-2.5 text-[var(--text-muted)]">
              {formatDateTime(record.validatedAt)}
            </td>
          </tr>
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
