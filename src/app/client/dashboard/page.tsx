"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import type { UploadBatchSummary, UserSummary } from "@/lib/types";
import { StatTile } from "@/components/StatTile";
import { FormError } from "@/components/FormError";

interface Aggregate {
  totalUsers: number;
  totalUploads: number;
  totalRecords: number;
  totalValid: number;
  totalInvalid: number;
  totalSoftBounce: number;
}

export default function ClientDashboardPage() {
  const [aggregate, setAggregate] = useState<Aggregate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const users = await apiFetch<UserSummary[]>("/client/users");

        // NOTE: the contract has no cross-user aggregate endpoint, so this
        // is computed client-side by fetching each user's uploads and
        // summing the rollups. Fine for a scaffold; a real dashboard with
        // many users would want a dedicated backend aggregate endpoint.
        const uploadsByUser = await Promise.all(
          users.map((u) =>
            apiFetch<UploadBatchSummary[]>(`/client/users/${u.id}/uploads`)
          )
        );

        const allUploads = uploadsByUser.flat();
        const agg: Aggregate = {
          totalUsers: users.length,
          totalUploads: allUploads.length,
          totalRecords: allUploads.reduce((sum, b) => sum + b.totalRecords, 0),
          totalValid: allUploads.reduce((sum, b) => sum + b.validCount, 0),
          totalInvalid: allUploads.reduce((sum, b) => sum + b.invalidCount, 0),
          totalSoftBounce: allUploads.reduce(
            (sum, b) => sum + b.softBounceCount,
            0
          ),
        };
        setAggregate(agg);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Client Dashboard
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Aggregated across all of your users&apos; uploads (computed
        client-side from the per-user upload lists — there is no dedicated
        aggregate endpoint).
      </p>

      <FormError message={error} />

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      ) : aggregate ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile label="Total Users" value={aggregate.totalUsers} />
          <StatTile label="Upload Batches" value={aggregate.totalUploads} />
          <StatTile label="Total Records" value={aggregate.totalRecords} />
          <StatTile label="Valid" value={aggregate.totalValid} tone="good" />
          <StatTile label="Invalid" value={aggregate.totalInvalid} tone="bad" />
          <StatTile
            label="Soft Bounce"
            value={aggregate.totalSoftBounce}
            tone="warn"
          />
        </div>
      ) : null}
    </div>
  );
}
