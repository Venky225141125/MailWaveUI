"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { UserSummary } from "@/lib/types";
import { FormError } from "@/components/FormError";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";

export default function ClientUsersPage() {
  const params = useParams<{ id: string }>();
  const clientId = params.id;

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<UserSummary[]>(
          `/superadmin/clients/${clientId}/users`
        );
        setUsers(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load users.");
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
          href={`/super-admin/clients/${clientId}`}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Client detail
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Client&apos;s Users
        </h1>
      </div>

      <FormError message={error} />

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Official Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Uploads</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-zinc-500">
                  No users found for this client.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                    {user.username}
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {user.officialEmail}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(user.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/super-admin/users/${user.id}/uploads`}
                      className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                    >
                      View uploads
                    </Link>
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
