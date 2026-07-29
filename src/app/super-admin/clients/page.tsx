"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { ClientSummary } from "@/lib/types";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";

const STATUS_OPTIONS = ["", "ACTIVE", "PENDING_APPROVAL", "DISABLED", "REJECTED"];
const TYPE_OPTIONS = ["", "ORGANIZATION", "FREELANCER"];

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (type) params.set("type", type);
        const qs = params.toString();
        const data = await apiFetch<ClientSummary[]>(
          `/superadmin/clients${qs ? `?${qs}` : ""}`
        );
        if (!cancelled) setClients(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load clients.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [status, type, refreshKey]);

  async function handleApprove(id: number) {
    setActionError(null);
    setActingId(id);
    try {
      await apiFetch<ClientSummary>(`/superadmin/clients/${id}/approve`, {
        method: "POST",
      });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to approve client.");
    } finally {
      setActingId(null);
    }
  }

  async function handleReject(id: number) {
    setActionError(null);
    setActingId(id);
    try {
      await apiFetch<ClientSummary>(`/superadmin/clients/${id}/reject`, {
        method: "POST",
      });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to reject client.");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Clients
      </h1>

      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "" ? "All statuses" : opt.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "" ? "All types" : opt}
            </option>
          ))}
        </select>
      </div>

      <FormError message={error ?? actionError} />

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Registered</th>
              <th className="px-4 py-2">Users</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-zinc-500">
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                    <Link
                      href={`/super-admin/clients/${client.id}`}
                      className="hover:underline"
                    >
                      {client.companyName}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {client.clientType}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {client.username}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {client.officialEmail}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(client.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/super-admin/clients/${client.id}/users`}
                      className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                    >
                      View
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {client.clientType === "FREELANCER" &&
                    client.status === "PENDING_APPROVAL" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={actingId === client.id}
                          onClick={() => handleApprove(client.id)}
                          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={actingId === client.id}
                          onClick={() => handleReject(client.id)}
                          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
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
