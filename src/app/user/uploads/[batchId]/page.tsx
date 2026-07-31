"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import {
  getUpload,
  listUploadRecords,
} from "@/services/userUploadService";
import type { EmailRecordResponse, Page, UploadBatchSummary } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ValidationStatsGrid } from "@/components/common/ValidationStatsGrid";
import { EmailRecordsPanel } from "@/components/common/EmailRecordsPanel";
import { StatsGridSkeleton } from "@/components/common/Skeleton";
import { formatDateTime } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/upload.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export default function UploadBatchDetailPage() {
  const params = useParams<{ batchId: string }>();
  const batchId = params.batchId;

  const [batch, setBatch] = useState<UploadBatchSummary | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [records, setRecords] = useState<Page<EmailRecordResponse> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBatch() {
      try {
        setBatch(await getUpload(batchId));
      } catch (err) {
        setError(err instanceof ApiError ? err.message : GENERIC_ERROR);
      }
    }
    if (batchId) loadBatch();
  }, [batchId]);

  useEffect(() => {
    async function loadRecords() {
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
    if (batchId) loadRecords();
  }, [batchId, status, page]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={batch?.originalFilename ?? "Upload Batch"}
        description={
          batch
            ? `Uploaded ${formatDateTime(batch.uploadedAt)}`
            : undefined
        }
        backHref={ROUTES.user.uploads}
        backLabel="All uploads"
        action={batch ? <StatusBadge status={batch.status} /> : undefined}
      />
      <Alert message={error} />
      {batch ? (
        <ValidationStatsGrid
          aggregate={{
            totalRecords: batch.totalRecords,
            valid: batch.validCount,
            invalid: batch.invalidCount,
            softBounce: batch.softBounceCount,
            hardBounce: batch.hardBounceCount,
            pending: batch.pendingCount,
          }}
        />
      ) : !error ? (
        <StatsGridSkeleton />
      ) : null}
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
