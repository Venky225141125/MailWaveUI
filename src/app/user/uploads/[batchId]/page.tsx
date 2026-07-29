"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { EmailRecordResponse, Page, UploadBatchSummary } from "@/lib/types";
import { StatTile } from "@/components/StatTile";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { Pagination } from "@/components/Pagination";
import { formatDateTime } from "@/lib/format";

const STATUS_OPTIONS = ["", "PENDING", "VALID", "INVALID", "SOFT_BOUNCE", "HARD_BOUNCE"];

export default function UploadBatchDetailPage() {
  const params = useParams<{ batchId: string }>();
  const batchId = params.batchId;

  const [batch, setBatch] = useState<UploadBatchSummary | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [records, setRecords] = useState<Page<EmailRecordResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBatch() {
      try {
        const data = await apiFetch<UploadBatchSummary>(`/user/uploads/${batchId}`);
        setBatch(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load batch.");
      }
    }
    if (batchId) loadBatch();
  }, [batchId]);

  useEffect(() => {
    async function loadRecords() {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (status) qs.set("status", status);
        qs.set("page", String(page));
        qs.set("size", "20");
        const data = await apiFetch<Page<EmailRecordResponse>>(
          `/user/uploads/${batchId}/records?${qs.toString()}`
        );
        setRecords(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load records.");
      } finally {
        setLoading(false);
      }
    }
    if (batchId) loadRecords();
  }, [batchId, status, page]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {batch?.originalFilename ?? "Upload Batch"}
        </h1>
        {batch ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Uploaded {formatDateTime(batch.uploadedAt)} ·{" "}
            <StatusBadge status={batch.status} />
          </p>
        ) : null}
      </div>

      <FormError message={error} />

      {batch ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile label="Total" value={batch.totalRecords} />
          <StatTile label="Pending" value={batch.pendingCount} tone="info" />
          <StatTile label="Valid" value={batch.validCount} tone="good" />
          <StatTile label="Invalid" value={batch.invalidCount} tone="bad" />
          <StatTile label="Soft Bounce" value={batch.softBounceCount} tone="warn" />
          <StatTile label="Hard Bounce" value={batch.hardBounceCount} tone="bad" />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Filter by status
        </label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "" ? "All" : opt.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Invalid Reason</th>
              <th className="px-4 py-2">Validated At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : !records || records.content.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-zinc-500">
                  No records found.
                </td>
              </tr>
            ) : (
              records.content.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                    {record.email}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {record.invalidReason ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(record.validatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {records ? (
        <Pagination
          page={records.page}
          totalPages={records.totalPages}
          onChange={setPage}
        />
      ) : null}
    </div>
  );
}
