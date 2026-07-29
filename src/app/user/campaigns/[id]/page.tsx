"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { CampaignSummary } from "@/lib/types";
import { StatTile } from "@/components/StatTile";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;

  const [campaign, setCampaign] = useState<CampaignSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<CampaignSummary>(
          `/user/campaigns/${campaignId}`
        );
        setCampaign(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load campaign.");
      } finally {
        setLoading(false);
      }
    }
    if (campaignId) load();
  }, [campaignId]);

  return (
    <div className="flex flex-col gap-6">
      <FormError message={error} />

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      ) : campaign ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {campaign.name}
            </h1>
            <StatusBadge status={campaign.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile
              label="Recipients / Sent"
              value={`${campaign.recipientsCount} / ${campaign.sentCount}`}
            />
            <StatTile label="Opened" value={campaign.openedCount} tone="good" />
            <StatTile
              label="Not Opened"
              value={campaign.notOpenedCount}
              tone="warn"
            />
            <StatTile label="Status" value={campaign.status} />
          </div>

          <dl className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-3">
            <DetailRow label="Created" value={formatDateTime(campaign.createdAt)} />
            <DetailRow
              label="Scheduled At"
              value={formatDateTime(campaign.scheduledAt)}
            />
            <DetailRow label="Sent At" value={formatDateTime(campaign.sentAt)} />
          </dl>
        </>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Campaign not found.
        </p>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}
