"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { UploadBatchSummary } from "@/lib/types";
import { StatTile } from "@/components/StatTile";
import { FormError } from "@/components/FormError";

interface Aggregate {
  totalRecords: number;
  valid: number;
  invalid: number;
  softBounce: number;
  hardBounce: number;
  pending: number;
}

export default function UserDashboardPage() {
  const [aggregate, setAggregate] = useState<Aggregate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const batches = await apiFetch<UploadBatchSummary[]>("/user/uploads");
        const agg: Aggregate = {
          totalRecords: batches.reduce((s, b) => s + b.totalRecords, 0),
          valid: batches.reduce((s, b) => s + b.validCount, 0),
          invalid: batches.reduce((s, b) => s + b.invalidCount, 0),
          softBounce: batches.reduce((s, b) => s + b.softBounceCount, 0),
          hardBounce: batches.reduce((s, b) => s + b.hardBounceCount, 0),
          pending: batches.reduce((s, b) => s + b.pendingCount, 0),
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <Link
          href="/user/uploads/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          + New Upload
        </Link>
      </div>

      <FormError message={error} />

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      ) : aggregate ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile label="Total Records" value={aggregate.totalRecords} />
          <StatTile label="Valid" value={aggregate.valid} tone="good" />
          <StatTile label="Invalid" value={aggregate.invalid} tone="bad" />
          <StatTile label="Soft Bounce" value={aggregate.softBounce} tone="warn" />
          <StatTile label="Hard Bounce" value={aggregate.hardBounce} tone="bad" />
          <StatTile
            label="Pending"
            value={aggregate.pending}
            tone="info"
          />
        </div>
      ) : null}
    </div>
  );
}
