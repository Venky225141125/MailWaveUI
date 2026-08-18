"use client";

import { listUsers, listUserUploads } from "@/services/clientService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useToastOnError } from "@/hooks/useToastOnError";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/common/StatTile";
import { DashboardSkeleton } from "@/components/common/Skeleton";

export default function ClientDashboardPage() {
  const { data: aggregate, loading, error } = useAsyncData(async () => {
    const users = await listUsers();
    const uploadsByUser = await Promise.all(
      users.map((u) => listUserUploads(u.id))
    );
    const allUploads = uploadsByUser.flat();
    return {
      totalUsers: users.length,
      totalUploads: allUploads.length,
      totalRecords: allUploads.reduce((sum, b) => sum + b.totalRecords, 0),
      totalValid: allUploads.reduce((sum, b) => sum + b.validCount, 0),
      totalInvalid: allUploads.reduce((sum, b) => sum + b.invalidCount, 0),
      totalSoftBounce: allUploads.reduce((sum, b) => sum + b.softBounceCount, 0),
    };
  }, []);
  useToastOnError(error);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Rolled-up view across your team’s uploads (aggregated client-side until a dedicated backend endpoint exists)."
      />
      {aggregate ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile label="Total Users" value={aggregate.totalUsers} />
          <StatTile label="Upload Batches" value={aggregate.totalUploads} />
          <StatTile label="Total Records" value={aggregate.totalRecords} />
          <StatTile label="Valid" value={aggregate.totalValid} tone="good" />
          <StatTile label="Invalid" value={aggregate.totalInvalid} tone="bad" />
          <StatTile
            label="Soft Bounce"
            value={aggregate.totalSoftBounce}
            tone="warn"
          />
        </div>
      ) : null}
    </div>
  );
}
