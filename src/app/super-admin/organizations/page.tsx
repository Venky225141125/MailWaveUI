"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import {
  createOrganization,
  listOrganizations,
} from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { formatDateTime } from "@/lib/utils";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export default function OrganizationsPage() {
  const { data: orgs, loading, error, reload } = useAsyncData(
    () => listOrganizations(),
    []
  );
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await createOrganization({ name, website });
      setName("");
      setWebsite("");
      reload();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Organizations"
        description="Whitelist that company sign-up checks against — name and website must match exactly."
      />
      <Card>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <Input
              label="Organization Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Website"
              required
              placeholder="https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Adding…" : "Add Organization"}
          </Button>
        </form>
        <div className="mt-3">
          <Alert message={formError} />
        </div>
      </Card>
      <Alert message={error} />
      <DataTable
        columns={["Name", "Website", "Registered"]}
        loading={loading}
        empty={!loading && (orgs?.length ?? 0) === 0}
        emptyMessage="No organizations registered yet."
        minWidth="480px"
      >
        {(orgs ?? []).map((org) => (
          <tr key={org.id}>
            <td className="px-4 py-2.5 font-medium text-[var(--text)]">
              {org.name}
            </td>
            <td className="px-4 py-2.5 text-[var(--text-muted)]">{org.website}</td>
            <td className="px-4 py-2.5 text-[var(--text-muted)]">
              {formatDateTime(org.createdAt)}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
