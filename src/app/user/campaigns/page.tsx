"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { CampaignSummary } from "@/lib/types";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime, formatNumber } from "@/lib/format";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<CampaignSummary[]>("/user/campaigns");
        setCampaigns(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load campaigns.");
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
          Campaigns
        </h1>
        <Link
          href="/user/campaigns/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          + New Campaign
        </Link>
      </div>

      <FormError message={error} />

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Recipients</th>
              <th className="px-4 py-2">Sent</th>
              <th className="px-4 py-2">Opened</th>
              <th className="px-4 py-2">Not Opened</th>
              <th className="px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-zinc-500">
                  No campaigns yet.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                    <Link href={`/user/campaigns/${c.id}`} className="hover:underline">
                      {c.name}
                    </Link>
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
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(c.createdAt)}
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
