"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { ClientSummary } from "@/lib/types";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const clientId = params.id;

  const [client, setClient] = useState<ClientSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<ClientSummary>(
          `/superadmin/clients/${clientId}`
        );
        setClient(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load client.");
      } finally {
        setLoading(false);
      }
    }
    if (clientId) load();
  }, [clientId]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/super-admin/clients"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← All clients
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Client Detail
        </h1>
      </div>

      <FormError message={error} />

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      ) : client ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {client.companyName}
            </h2>
            <StatusBadge status={client.status} />
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow label="Client Type" value={client.clientType} />
            <DetailRow label="Username" value={client.username} />
            <DetailRow label="Official Email" value={client.officialEmail} />
            <DetailRow label="Phone Number" value={client.phoneNumber} />
            <DetailRow
              label="Registered"
              value={formatDateTime(client.createdAt)}
            />
          </dl>
          <Link
            href={`/super-admin/clients/${client.id}/users`}
            className="mt-6 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            View this client&apos;s Users
          </Link>
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Client not found.
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
