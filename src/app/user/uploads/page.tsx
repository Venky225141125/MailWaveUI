"use client";

import { listUploads } from "@/services/userUploadService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/LinkButton";
import { Alert } from "@/components/ui/Alert";
import { UploadBatchTable } from "@/components/common/UploadBatchTable";
import { ROUTES } from "@/constants/routes.constants";

export default function UserUploadsPage() {
  const { data: batches, loading, error } = useAsyncData(
    () => listUploads(),
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Uploads"
        description="Lists you’ve uploaded for validation."
        action={
          <LinkButton href={ROUTES.user.newUpload}>+ New Upload</LinkButton>
        }
      />
      <Alert message={error} />
      <UploadBatchTable
        batches={batches ?? []}
        loading={loading}
        hrefForBatch={(b) => ROUTES.user.upload(b.id)}
      />
    </div>
  );
}
