"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import type { CreateUserResponse } from "@/lib/types";
import { FormError } from "@/components/FormError";

export default function CreateUserPage() {
  const [username, setUsername] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<CreateUserResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch<CreateUserResponse>("/client/users", {
        method: "POST",
        body: { username, officialEmail },
      });
      setCreated(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create user.");
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/40">
          <h1 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
            User created
          </h1>
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
            Share this temporary password with{" "}
            <strong>{created.username}</strong> now — it will not be shown
            again. They&apos;ll be required to reset it on first login.
          </p>
          <div className="mt-4 rounded-md border border-amber-300 bg-white px-4 py-3 font-mono text-lg font-semibold text-zinc-900 dark:border-amber-800 dark:bg-zinc-900 dark:text-zinc-50">
            {created.tempPassword ?? "(no temp password returned)"}
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Link
            href="/client/users"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Create User
      </h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <FormError message={error} />
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Official Email
          </label>
          <input
            type="email"
            required
            value={officialEmail}
            onChange={(e) => setOfficialEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {loading ? "Creating…" : "Create User"}
        </button>
      </form>
    </div>
  );
}
