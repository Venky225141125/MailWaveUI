"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { CampaignSummary, UploadBatchSummary } from "@/lib/types";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime, formatNumber } from "@/lib/format";

export default function ClientUserProgressPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  const [uploads, setUploads] = useState<UploadBatchSummary[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [uploadsRes, campaignsRes] = await Promise.all([
          apiFetch<UploadBatchSummary[]>(`/client/users/${userId}/uploads`),
          apiFetch<CampaignSummary[]>(`/client/users/${userId}/campaigns`),
        ]);
        setUploads(uploadsRes);
        setCampaigns(campaignsRes);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load progress.");
      } finally {
        setLoading(false);
      }
    }
    if (userId) load();
  }, [userId]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/client/users"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← All users
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          User Progress
        </h1>
      </div>

      <FormError message={error} />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Uploads
        </h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Valid</th>
                <th className="px-4 py-2">Invalid</th>
                <th className="px-4 py-2">Soft Bounce</th>
                <th className="px-4 py-2">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-zinc-500">
                    Loading…
                  </td>
                </tr>
              ) : uploads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-zinc-500">
                    No uploads yet.
                  </td>
                </tr>
              ) : (
                uploads.map((batch) => (
                  <tr key={batch.id}>
                    <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                      {batch.originalFilename}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="px-4 py-2">{formatNumber(batch.totalRecords)}</td>
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
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Campaigns
        </h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Recipients</th>
                <th className="px-4 py-2">Sent</th>
                <th className="px-4 py-2">Opened</th>
                <th className="px-4 py-2">Not Opened</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-zinc-500">
                    Loading…
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-zinc-500">
                    No campaigns yet.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                      {c.name}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-2">{formatNumber(c.recipientsCount)}</td>
                    <td className="px-4 py-2">{formatNumber(c.sentCount)}</td>
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">
                      {formatNumber(c.openedCount)}
                    </td>
                    <td className="px-4 py-2 text-amber-600 dark:text-amber-400">
                      {formatNumber(c.notOpenedCount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
