"use client";

import { listUploads } from "@/services/userUploadService";
import { aggregateUploadBatches } from "@/lib/utils";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/LinkButton";
import { Alert } from "@/components/ui/Alert";
import { ValidationStatsGrid } from "@/components/common/ValidationStatsGrid";
import { DashboardSkeleton } from "@/components/common/Skeleton";
import { ROUTES } from "@/constants/routes.constants";

export default function UserDashboardPage() {
  const { data: batches, loading, error } = useAsyncData(
    () => listUploads(),
    []
  );
  const aggregate = batches ? aggregateUploadBatches(batches) : null;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Validation health across all of your uploaded lists."
        action={
          <LinkButton href={ROUTES.user.newUpload}>+ New Upload</LinkButton>
        }
      />
      <Alert message={error} />
      {aggregate ? <ValidationStatsGrid aggregate={aggregate} /> : null}
    </div>
  );
}
