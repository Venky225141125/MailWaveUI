import { apiClient } from "@/lib/api";
import { USER_ENDPOINTS } from "@/constants/user-endpoints.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/upload.constants";
import { buildQueryString } from "@/lib/utils";
import type {
  EmailRecordQuery,
  EmailRecordResponse,
  Page,
  UploadBatchSummary,
} from "@/types";

export async function listUploads(): Promise<UploadBatchSummary[]> {
  return apiClient<UploadBatchSummary[]>(USER_ENDPOINTS.uploads);
}

export async function getUpload(
  batchId: string | number
): Promise<UploadBatchSummary> {
  return apiClient<UploadBatchSummary>(USER_ENDPOINTS.upload(batchId));
}

export async function createUpload(file: File): Promise<UploadBatchSummary> {
  const fd = new FormData();
  fd.append("file", file);
  return apiClient<UploadBatchSummary>(USER_ENDPOINTS.uploads, {
    method: "POST",
    body: fd,
  });
}

export async function listUploadRecords(
  batchId: string | number,
  query: EmailRecordQuery = {}
): Promise<Page<EmailRecordResponse>> {
  const qs = buildQueryString({
    status: query.status,
    page: query.page ?? 0,
    size: query.size ?? DEFAULT_PAGE_SIZE,
  });
  return apiClient<Page<EmailRecordResponse>>(
    `${USER_ENDPOINTS.uploadRecords(batchId)}${qs}`
  );
}
