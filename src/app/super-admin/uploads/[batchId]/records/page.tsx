"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import { listUploadRecords } from "@/services/superAdminService";
import type { EmailRecordResponse, Page } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { EmailRecordsPanel } from "@/components/common/EmailRecordsPanel";
import { DEFAULT_PAGE_SIZE } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export default function SuperAdminUploadRecordsPage() {
  const params = useParams<{ batchId: string }>();
  const batchId = params.batchId;

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [records, setRecords] = useState<Page<EmailRecordResponse> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        setRecords(
          await listUploadRecords(batchId, {
            status,
            page,
            size: DEFAULT_PAGE_SIZE,
          })
        );
      } catch (err) {
        setError(err instanceof ApiError ? err.message : GENERIC_ERROR);
      } finally {
        setLoading(false);
      }
    }
    if (batchId) load();
  }, [batchId, status, page]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Email Records"
        description="Per-address validation status and reasons."
        backHref={ROUTES.superAdmin.clients}
        backLabel="Clients"
      />
      <Alert message={error} />
      <EmailRecordsPanel
        records={records}
        loading={loading}
        status={status}
        onStatusChange={(s) => {
          setStatus(s);
          setPage(0);
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
