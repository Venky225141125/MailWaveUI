"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
import { Card } from "@/components/shared/card";
import { DetailList, DetailRow } from "@/components/shared/detail-list";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailSkeleton } from "@/components/common/Skeleton";
import { formatDateTime } from "@/lib/helpers";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { CopyableText } from "@/components/shared/copyable-text";

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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={client?.companyName ?? "Client Detail"}
        backHref={ROUTES.superAdmin.clients}
        backLabel="All clients"
        action={client ? <StatusBadge status={client.status} /> : undefined}
      />
      <Alert message={error ?? actionError} />
      {client ? (
        <Card>
          <DetailList>
            <DetailRow label="Client Type">{client.clientType}</DetailRow>
            <DetailRow label="Username">{client.username}</DetailRow>
            <DetailRow label="Official Email">
              <CopyableText value={client.officialEmail} />
            </DetailRow>
            <DetailRow label="Phone Number">{client.phoneNumber}</DetailRow>
            <DetailRow label="Registered">
              {formatDateTime(client.createdAt)}
            </DetailRow>
          </DetailList>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={ROUTES.superAdmin.clientUsers(client.id)}>
              View this client&apos;s Users
            </LinkButton>
            {client.status === "ACTIVE" ? (
              <Button variant="danger" disabled={acting} onClick={handleDeactivate}>
                Deactivate client
              </Button>
            ) : client.status === "DISABLED" ? (
              <Button
                disabled={acting}
                onClick={handleActivate}
                className="!bg-emerald-600 !text-white hover:!bg-emerald-700"
              >
                Activate client
              </Button>
            ) : null}
          </div>
        </Card>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">Client not found.</p>
      )}
    </div>
  );
}
