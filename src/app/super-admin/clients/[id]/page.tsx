"use client";

import { useParams } from "next/navigation";
import { getClient } from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { LinkButton } from "@/components/ui/LinkButton";
import { Card } from "@/components/ui/Card";
import { DetailList, DetailRow } from "@/components/ui/DetailList";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailSkeleton } from "@/components/common/Skeleton";
import { formatDateTime } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: client, loading, error } = useAsyncData(
    () => getClient(params.id),
    [params.id]
  );

  if (loading) return <DetailSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={client?.companyName ?? "Client Detail"}
        backHref={ROUTES.superAdmin.clients}
        backLabel="All clients"
        action={client ? <StatusBadge status={client.status} /> : undefined}
      />
      <Alert message={error} />
      {client ? (
        <Card>
          <DetailList>
            <DetailRow label="Client Type">{client.clientType}</DetailRow>
            <DetailRow label="Username">{client.username}</DetailRow>
            <DetailRow label="Official Email">{client.officialEmail}</DetailRow>
            <DetailRow label="Phone Number">{client.phoneNumber}</DetailRow>
            <DetailRow label="Registered">
              {formatDateTime(client.createdAt)}
            </DetailRow>
          </DetailList>
          <div className="mt-6">
            <LinkButton href={ROUTES.superAdmin.clientUsers(client.id)}>
              View this client&apos;s Users
            </LinkButton>
          </div>
        </Card>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">Client not found.</p>
      )}
    </div>
  );
}
