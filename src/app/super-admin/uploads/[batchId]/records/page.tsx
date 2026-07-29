"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { EmailRecordResponse, Page } from "@/lib/types";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { Pagination } from "@/components/Pagination";
import { formatDateTime } from "@/lib/format";

const STATUS_OPTIONS = ["", "PENDING", "VALID", "INVALID", "SOFT_BOUNCE", "HARD_BOUNCE"];

export default function SuperAdminUploadRecordsPage() {
  const params = useParams<{ batchId: string }>();
  const batchId = params.batchId;

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<EmailRecordResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        if (status) qs.set("status", status);
        qs.set("page", String(page));
        qs.set("size", "20");
        const res = await apiFetch<Page<EmailRecordResponse>>(
          `/superadmin/uploads/${batchId}/records?${qs.toString()}`
        );
        setData(res);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load records.");
      } finally {
        setLoading(false);
      }
    }
    if (batchId) load();
  }, [batchId, status, page]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Batch Records
      </h1>

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
        {data ? (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {data.totalElements} record(s)
          </span>
        ) : null}
      </div>

      <FormError message={error} />

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
            ) : !data || data.content.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-zinc-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.content.map((record) => (
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

      {data ? (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onChange={setPage}
        />
      ) : null}
    </div>
  );
}
