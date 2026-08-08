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
import { ApiError } from "@/lib/api";
import {
  activateClient,
  deactivateClient,
  getClient,
} from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/shared/button";
import { CopyableText } from "@/components/shared/copyable-text";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailSkeleton } from "@/components/common/Skeleton";
import { formatDateTime } from "@/lib/helpers";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { cn } from "@/lib/utils";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: client, loading, error, reload } = useAsyncData(
    () => getClient(params.id),
    [params.id]
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  async function handleActivate() {
    setActionError(null);
    setActing(true);
    try {
      await activateClient(params.id);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActing(false);
    }
  }

  async function handleDeactivate() {
    setActionError(null);
    setActing(true);
    try {
      await deactivateClient(params.id);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : GENERIC_ERROR);
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
        <Alert message={error ?? "Client not found."} />
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
      <Alert message={error ?? actionError} />

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
    </div>
  );
}
