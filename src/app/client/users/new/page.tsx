"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { createUser } from "@/services/clientService";
import type { CreateUserResponse } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { LinkButton } from "@/components/shared/link-button";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

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
      setCreated(await createUser({ username, officialEmail }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-[var(--radius-md)] border border-amber-300 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/40">
          <h1 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
            User created
          </h1>
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
            Share this temporary password with{" "}
            <strong>{created.username}</strong> now — it will not be shown
            again. They&apos;ll be required to reset it on first login.
          </p>
          <div className="mt-4 rounded-[var(--radius-sm)] border border-amber-300 bg-[var(--surface)] px-4 py-3 font-mono text-lg font-semibold text-[var(--text)]">
            {created.tempPassword ?? "(no temp password returned)"}
          </div>
        </div>
        <div className="mt-6">
          <LinkButton href={ROUTES.client.users}>Back to Users</LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="Create User"
        description="A one-time temporary password will be generated for you to share."
        backHref={ROUTES.client.users}
        backLabel="All users"
      />
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Alert message={error} />
        <Input
          label="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Official Email"
          type="email"
          required
          value={officialEmail}
          onChange={(e) => setOfficialEmail(e.target.value)}
        />
        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Creating…" : "Create User"}
        </Button>
      </form>
    </div>
  );
}
