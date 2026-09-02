"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  Calendar,
  Mail,
  Phone,
  Power,
  PowerOff,
  UserRound,
  Users,
} from "lucide-react";
import {
  activateClient,
  deactivateClient,
  getClient,
  updateClientQuota,
} from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useToastOnError } from "@/hooks/useToastOnError";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { CopyableText } from "@/components/shared/copyable-text";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailSkeleton } from "@/components/common/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, toastApiError, toastError, toastSuccess } from "@/lib/helpers";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import type { ClientSummary } from "@/types";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: client, loading, error, reload } = useAsyncData(
    () => getClient(params.id),
    [params.id]
  );
  useToastOnError(error);
  const [acting, setActing] = useState(false);

  async function handleActivate() {
    setActing(true);
    try {
      await activateClient(params.id);
      toastSuccess("Client activated");
      reload();
    } catch (err) {
      toastApiError(err);
    } finally {
      setActing(false);
    }
  }

  async function handleDeactivate() {
    setActing(true);
    try {
      await deactivateClient(params.id);
      toastSuccess("Client deactivated");
      reload();
    } catch (err) {
      toastApiError(err);
    } finally {
      setActing(false);
    }
  }

  if (loading) return <DetailSkeleton />;

  if (!client) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Client Detail"
          backHref={ROUTES.superAdmin.clients}
          backLabel="All clients"
        />
        <p className="text-sm text-muted-foreground">
          {error ?? "Client not found."}
        </p>
      </div>
    );
  }

  const initials = client.companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  const details = [
    {
      icon: Building2,
      label: "Client type",
      value: <StatusBadge status={client.clientType} />,
    },
    {
      icon: UserRound,
      label: "Username",
      value: (
        <span className="font-medium text-foreground">{client.username}</span>
      ),
    },
    {
      icon: Mail,
      label: "Official email",
      value: <CopyableText value={client.officialEmail} />,
    },
    {
      icon: Phone,
      label: "Phone",
      value: (
        <span className="font-medium text-foreground">
          {client.phoneNumber || "—"}
        </span>
      ),
    },
    {
      icon: Calendar,
      label: "Registered",
      value: (
        <span className="font-medium text-foreground">
          {formatDateTime(client.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Client detail"
        description="Review account details and manage access for this organization or freelancer."
        backHref={ROUTES.superAdmin.clients}
        backLabel="All clients"
      />

      <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm dark:border-border">
        <div
          className={cn(
            "relative border-b border-border/80 px-5 py-6 sm:px-7",
            "bg-gradient-to-br from-primary/15 via-card to-sky-500/10",
            "dark:from-primary/20 dark:via-card dark:to-sky-500/10"
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md">
                {initials || "CL"}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
                    {client.companyName}
                  </h2>
                  <StatusBadge status={client.status} />
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  @{client.username} · {client.officialEmail}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <LinkButton
                href={ROUTES.superAdmin.clientUsers(client.id)}
                className="gap-1.5"
              >
                <Users className="size-4" />
                View users
              </LinkButton>
              {client.status === "ACTIVE" ? (
                <Button
                  variant="danger"
                  disabled={acting}
                  onClick={handleDeactivate}
                  className="gap-1.5"
                >
                  <PowerOff className="size-4" />
                  {acting ? "Deactivating…" : "Deactivate"}
                </Button>
              ) : client.status === "DISABLED" ? (
                <Button
                  disabled={acting}
                  onClick={handleActivate}
                  className="gap-1.5 !bg-emerald-600 !text-white hover:!bg-emerald-700"
                >
                  <Power className="size-4" />
                  {acting ? "Activating…" : "Activate"}
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((item) => (
            <div
              key={item.label}
              className="flex gap-3 bg-card px-5 py-4 dark:bg-card"
            >
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <item.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  {item.label}
                </p>
                <div className="mt-1.5 text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ClientQuotaCard client={client} onUpdated={reload} />
    </div>
  );
}

function ClientQuotaCard({
  client,
  onUpdated,
}: {
  client: ClientSummary;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [dailySendLimit, setDailySendLimit] = useState(String(client.dailySendLimit));
  const [monthlySendLimit, setMonthlySendLimit] = useState(String(client.monthlySendLimit));
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setDailySendLimit(String(client.dailySendLimit));
    setMonthlySendLimit(String(client.monthlySendLimit));
    setEditing(true);
  }

  async function handleSave() {
    const daily = Number(dailySendLimit);
    const monthly = Number(monthlySendLimit);
    if (!Number.isInteger(daily) || daily < 1 || !Number.isInteger(monthly) || monthly < 1) {
      toastError("Daily and monthly limits must be whole numbers of at least 1.");
      return;
    }
    setSaving(true);
    try {
      await updateClientQuota(client.id, {
        dailySendLimit: daily,
        monthlySendLimit: monthly,
      });
      toastSuccess("Quota updated");
      setEditing(false);
      onUpdated();
    } catch (err) {
      toastApiError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sending quota</CardTitle>
        {!editing ? (
          <Button variant="secondary" size="sm" onClick={startEditing}>
            Edit
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Daily send limit"
                type="number"
                min={1}
                value={dailySendLimit}
                onChange={(e) => setDailySendLimit(e.target.value)}
              />
              <Input
                label="Monthly send limit"
                type="number"
                min={1}
                value={monthlySendLimit}
                onChange={(e) => setMonthlySendLimit(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button disabled={saving} onClick={handleSave}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button
                variant="secondary"
                disabled={saving}
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Today
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {client.sentToday} / {client.dailySendLimit} sent
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                This month
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {client.sentThisMonth} / {client.monthlySendLimit} sent
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
