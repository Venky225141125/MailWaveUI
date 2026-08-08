"use client";

import { listOrganizations, listClients } from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { StatTile } from "@/components/common/StatTile";
import { LinkButton } from "@/components/shared/link-button";
import { DashboardSkeleton } from "@/components/common/Skeleton";
import { ROUTES } from "@/constants/routes.constants";

export default function SuperAdminDashboardPage() {
  const { data, loading, error } = useAsyncData(async () => {
    const [orgs, clients] = await Promise.all([
      listOrganizations(),
      listClients(),
    ]);
    return { orgs, clients };
  }, []);

  if (loading) return <DashboardSkeleton tiles={4} />;

  const orgs = data?.orgs ?? [];
  const clients = data?.clients ?? [];
  const pendingFreelancers = clients.filter(
    (c) => c.clientType === "FREELANCER" && c.status === "PENDING_APPROVAL"
  ).length;
  const activeClients = clients.filter((c) => c.status === "ACTIVE").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Platform-wide overview of organizations and clients."
      />
      <Alert message={error} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Organizations" value={orgs.length} />
        <StatTile label="Total Clients" value={clients.length} />
        <StatTile label="Active Clients" value={activeClients} tone="good" />
        <StatTile
          label="Pending Freelancer Approvals"
          value={pendingFreelancers}
          tone={pendingFreelancers > 0 ? "warn" : "default"}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <LinkButton href={ROUTES.superAdmin.organizations} variant="secondary">
          Manage Organizations
        </LinkButton>
        <LinkButton href={ROUTES.superAdmin.clients} variant="secondary">
          Review Clients
        </LinkButton>
      </div>
    </div>
  );
}
