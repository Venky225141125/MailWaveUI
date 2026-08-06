"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import {
  activateClient,
  approveClient,
  deactivateClient,
  listClients,
  rejectClient,
} from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

const STATUS_OPTIONS = ["", "ACTIVE", "PENDING_APPROVAL", "DISABLED", "REJECTED"];
const TYPE_OPTIONS = ["", "ORGANIZATION", "FREELANCER"];

export default function ClientsPage() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);

  const { data: clients, loading, error, reload } = useAsyncData(
    () => listClients({ status, type }),
    [status, type]
  );

  async function handleApprove(id: number) {
    setActionError(null);
    setActingId(id);
    try {
      await approveClient(id);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActingId(null);
    }
  }

  async function handleReject(id: number) {
    setActionError(null);
    setActingId(id);
    try {
      await rejectClient(id);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActingId(null);
    }
  }

  async function handleActivate(id: number) {
    setActionError(null);
    setActingId(id);
    try {
      await activateClient(id);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActingId(null);
    }
  }

  async function handleDeactivate(id: number) {
    setActionError(null);
    setActingId(id);
    try {
      await deactivateClient(id);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clients"
        description="Organizations and freelancers on the platform. Approve pending freelancers here."
      />
      <div className="flex flex-wrap gap-3">
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt || "all-status"} value={opt}>
              {opt === "" ? "All statuses" : opt.replaceAll("_", " ")}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt || "all-type"} value={opt}>
              {opt === "" ? "All types" : opt}
            </option>
          ))}
        </Select>
      </div>
      <Alert message={error ?? actionError} />
      <DataTable
        columns={[
          "Company",
          "Type",
          "Username",
          "Email",
          "Status",
          "Registered",
          "Users",
          "Actions",
        ]}
        loading={loading}
        empty={!loading && (clients?.length ?? 0) === 0}
        emptyMessage="No clients found."
        minWidth="820px"
      >
        {(clients ?? []).map((client) => (
          <tr key={client.id}>
            <td className="px-4 py-2.5 font-medium">
              <Link
                href={ROUTES.superAdmin.client(client.id)}
                className="text-[var(--brand)] hover:underline"
              >
                {client.companyName}
              </Link>
            </td>
            <td className="px-4 py-2.5 text-[var(--text-muted)]">
              {client.clientType}
            </td>
            <td className="px-4 py-2.5 text-[var(--text-muted)]">
              {client.username}
            </td>
            <td className="px-4 py-2.5 text-[var(--text-muted)]">
              {client.officialEmail}
            </td>
            <td className="px-4 py-2.5">
              <StatusBadge status={client.status} />
            </td>
            <td className="px-4 py-2.5 text-[var(--text-muted)]">
              {formatDateTime(client.createdAt)}
            </td>
            <td className="px-4 py-2.5">
              <Link
                href={ROUTES.superAdmin.clientUsers(client.id)}
                className="font-medium text-[var(--brand)] hover:underline"
              >
                View
              </Link>
            </td>
            <td className="px-4 py-2.5">
              {client.clientType === "FREELANCER" &&
              client.status === "PENDING_APPROVAL" ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={actingId === client.id}
                    onClick={() => handleApprove(client.id)}
                    className="!bg-emerald-600 !text-white hover:!bg-emerald-700"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={actingId === client.id}
                    onClick={() => handleReject(client.id)}
                  >
                    Reject
                  </Button>
                </div>
              ) : client.status === "ACTIVE" ? (
                <Button
                  size="sm"
                  variant="danger"
                  disabled={actingId === client.id}
                  onClick={() => handleDeactivate(client.id)}
                >
                  Deactivate
                </Button>
              ) : client.status === "DISABLED" ? (
                <Button
                  size="sm"
                  disabled={actingId === client.id}
                  onClick={() => handleActivate(client.id)}
                  className="!bg-emerald-600 !text-white hover:!bg-emerald-700"
                >
                  Activate
                </Button>
              ) : (
                <span className="text-[var(--text-subtle)]">—</span>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
