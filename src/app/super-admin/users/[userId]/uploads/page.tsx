"use client";

import { useParams } from "next/navigation";
import { listUserUploads } from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { UploadBatchTable } from "@/components/common/UploadBatchTable";
import { ROUTES } from "@/constants/routes.constants";

export default function SuperAdminUserUploadsPage() {
  const params = useParams<{ userId: string }>();
  const { data: batches, loading, error } = useAsyncData(
    () => listUserUploads(params.userId),
    [params.userId]
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="User Uploads"
        description="Read-only view of this user’s validation batches."
        backHref={ROUTES.superAdmin.clients}
        backLabel="Clients"
      />
      <Alert message={error} />
      <UploadBatchTable
        batches={batches ?? []}
        loading={loading}
        hrefForBatch={(b) => ROUTES.superAdmin.uploadRecords(b.id)}
      />
    </div>
  );
}
