"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { UploadBatchSummary } from "@/lib/types";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime, formatNumber } from "@/lib/format";

export default function UserUploadsPage() {
  const [batches, setBatches] = useState<UploadBatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<UploadBatchSummary[]>("/user/uploads");
        setBatches(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load uploads.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Uploads
        </h1>
        <Link
          href="/user/uploads/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          + New Upload
        </Link>
      </div>

      <FormError message={error} />

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Pending</th>
              <th className="px-4 py-2">Valid</th>
              <th className="px-4 py-2">Invalid</th>
              <th className="px-4 py-2">Soft Bounce</th>
              <th className="px-4 py-2">Uploaded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : batches.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-zinc-500">
                  No uploads yet.
                </td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                    <Link
                      href={`/user/uploads/${batch.id}`}
                      className="hover:underline"
                    >
                      {batch.originalFilename}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="px-4 py-2">{formatNumber(batch.totalRecords)}</td>
                  <td className="px-4 py-2">{formatNumber(batch.pendingCount)}</td>
                  <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">
                    {formatNumber(batch.validCount)}
                  </td>
                  <td className="px-4 py-2 text-red-600 dark:text-red-400">
                    {formatNumber(batch.invalidCount)}
                  </td>
                  <td className="px-4 py-2 text-orange-600 dark:text-orange-400">
                    {formatNumber(batch.softBounceCount)}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(batch.uploadedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
