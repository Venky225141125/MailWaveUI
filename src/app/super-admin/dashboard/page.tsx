"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { ClientSummary, OrganizationResponse } from "@/lib/types";
import { StatTile } from "@/components/StatTile";
import { FormError } from "@/components/FormError";

export default function SuperAdminDashboardPage() {
  const [orgs, setOrgs] = useState<OrganizationResponse[]>([]);
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [orgsRes, clientsRes] = await Promise.all([
          apiFetch<OrganizationResponse[]>("/superadmin/organizations"),
          apiFetch<ClientSummary[]>("/superadmin/clients"),
        ]);
        setOrgs(orgsRes);
        setClients(clientsRes);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pendingFreelancers = clients.filter(
    (c) => c.clientType === "FREELANCER" && c.status === "PENDING_APPROVAL"
  ).length;
  const activeClients = clients.filter((c) => c.status === "ACTIVE").length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Super Admin Dashboard
      </h1>
      <FormError message={error} />

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Organizations" value={orgs.length} />
          <StatTile label="Total Clients" value={clients.length} />
          <StatTile label="Active Clients" value={activeClients} tone="good" />
          <StatTile
            label="Pending Freelancer Approvals"
            value={pendingFreelancers}
            tone={pendingFreelancers > 0 ? "warn" : "default"}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/super-admin/organizations"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Manage Organizations
        </Link>
        <Link
          href="/super-admin/clients"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Review Clients
        </Link>
      </div>
    </div>
  );
}
