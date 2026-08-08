"use client";

import { listUploads } from "@/services/userUploadService";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  useAccountStatus,
  isAccountDisabledError,
} from "@/components/providers/account-status-provider";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/shared/link-button";
import { Alert } from "@/components/shared/alert";
import { UploadBatchTable } from "@/components/common/UploadBatchTable";
import { ROUTES } from "@/constants/routes.constants";

export default function UserUploadsPage() {
  const { isActive, markInactive } = useAccountStatus();
  const { data: batches, loading, error } = useAsyncData(async () => {
    try {
      return await listUploads();
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      throw err;
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Uploads"
        description="Lists you’ve uploaded for validation."
        action={
          <LinkButton href={ROUTES.user.newUpload} disabled={!isActive}>
            + New Upload
          </LinkButton>
        }
      />
      <Alert message={error} />
      <UploadBatchTable
        batches={batches ?? []}
        loading={loading}
        hrefForBatch={isActive ? (b) => ROUTES.user.upload(b.id) : undefined}
      />
    </div>
  );
}
