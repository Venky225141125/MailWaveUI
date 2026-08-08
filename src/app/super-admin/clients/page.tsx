"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  Power,
  PowerOff,
  Users,
  XCircle,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  activateClient,
  approveClient,
  deactivateClient,
  listClients,
  rejectClient,
} from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { Select } from "@/components/shared/select";
import { DataTable } from "@/components/shared/data-table";
import { RowActions, type RowAction } from "@/components/shared/row-actions";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/helpers";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { CopyableText } from "@/components/shared/copyable-text";

const STATUS_OPTIONS = ["", "ACTIVE", "PENDING_APPROVAL", "DISABLED", "REJECTED"];
const TYPE_OPTIONS = ["", "ORGANIZATION", "FREELANCER"];

export default function ClientsPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);

  const { data: clients, loading, error, reload } = useAsyncData(
    () => listClients({ status, type }),
    [status, type]
  );

  async function runAction(id: number, action: () => Promise<unknown>) {
    setActionError(null);
    setActingId(id);
    try {
      await action();
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
      <div className="flex flex-wrap gap-3 rounded-xl border border-border/80 bg-card/80 p-3 shadow-sm dark:bg-card">
        <Select
          aria-label="Filter by status"
          value={status}
          onValueChange={setStatus}
          placeholder="All statuses"
          options={STATUS_OPTIONS.map((opt) => ({
            value: opt,
            label: opt === "" ? "All statuses" : opt.replaceAll("_", " "),
          }))}
        />
        <Select
          aria-label="Filter by type"
          value={type}
          onValueChange={setType}
          placeholder="All types"
          options={TYPE_OPTIONS.map((opt) => ({
            value: opt,
            label: opt === "" ? "All types" : opt,
          }))}
        />
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
          "",
        ]}
        loading={loading}
        empty={!loading && (clients?.length ?? 0) === 0}
        emptyMessage="No clients found."
        minWidth="820px"
      >
        {(clients ?? []).map((client) => {
          const busy = actingId === client.id;
          const actions: RowAction[] = [
            {
              label: "View detail",
              icon: <Eye className="size-4" />,
              onSelect: () =>
                router.push(ROUTES.superAdmin.client(client.id)),
            },
            {
              label: "View users",
              icon: <Users className="size-4" />,
              onSelect: () =>
                router.push(ROUTES.superAdmin.clientUsers(client.id)),
            },
          ];

          if (
            client.clientType === "FREELANCER" &&
            client.status === "PENDING_APPROVAL"
          ) {
            actions.push(
              {
                label: busy ? "Approving…" : "Approve",
                icon: <CheckCircle2 className="size-4" />,
                disabled: busy,
                separatorBefore: true,
                onSelect: () =>
                  runAction(client.id, () => approveClient(client.id)),
              },
              {
                label: busy ? "Rejecting…" : "Reject",
                icon: <XCircle className="size-4" />,
                destructive: true,
                disabled: busy,
                onSelect: () =>
                  runAction(client.id, () => rejectClient(client.id)),
              }
            );
          } else if (client.status === "ACTIVE") {
            actions.push({
              label: busy ? "Deactivating…" : "Deactivate",
              icon: <PowerOff className="size-4" />,
              destructive: true,
              disabled: busy,
              separatorBefore: true,
              onSelect: () =>
                runAction(client.id, () => deactivateClient(client.id)),
            });
          } else if (client.status === "DISABLED") {
            actions.push({
              label: busy ? "Activating…" : "Activate",
              icon: <Power className="size-4" />,
              disabled: busy,
              separatorBefore: true,
              onSelect: () =>
                runAction(client.id, () => activateClient(client.id)),
            });
          }

          return (
            <TableRow key={client.id}>
              <TableCell className="px-4 py-3.5 font-medium">
                <button
                  type="button"
                  className="text-left text-primary hover:underline"
                  onClick={() =>
                    router.push(ROUTES.superAdmin.client(client.id))
                  }
                >
                  {client.companyName}
                </button>
              </TableCell>
              <TableCell className="px-4 py-3.5">
                <StatusBadge status={client.clientType} />
              </TableCell>
              <TableCell className="px-4 py-3.5 text-muted-foreground">
                {client.username}
              </TableCell>
              <TableCell className="px-4 py-3.5 text-muted-foreground">
                <CopyableText value={client.officialEmail} />
              </TableCell>
              <TableCell className="px-4 py-3.5">
                <StatusBadge status={client.status} />
              </TableCell>
              <TableCell className="px-4 py-3.5 text-muted-foreground">
                {formatDateTime(client.createdAt)}
              </TableCell>
              <TableCell className="px-2 py-3.5 text-right">
                <RowActions actions={actions} />
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>
    </div>
  );
}
