"use client";

import { listUploads } from "@/services/userUploadService";
import { aggregateUploadBatches } from "@/lib/helpers";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  useAccountStatus,
  isAccountDisabledError,
} from "@/components/providers/account-status-provider";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/shared/link-button";
import { Alert } from "@/components/shared/alert";
import { ValidationStatsGrid } from "@/components/common/ValidationStatsGrid";
import { DashboardSkeleton } from "@/components/common/Skeleton";
import { ROUTES } from "@/constants/routes.constants";

export default function UserDashboardPage() {
  const { isActive, markInactive } = useAccountStatus();
  const { data: batches, loading, error } = useAsyncData(async () => {
    try {
      return await listUploads();
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      throw err;
    }
  }, []);
  const aggregate = batches ? aggregateUploadBatches(batches) : null;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Validation health across all of your uploaded lists."
        action={
          <LinkButton href={ROUTES.user.newUpload} disabled={!isActive}>
            + New Upload
          </LinkButton>
        }
      />
      <Alert message={error} />
      {aggregate ? <ValidationStatsGrid aggregate={aggregate} /> : null}
    </div>
  );
}
