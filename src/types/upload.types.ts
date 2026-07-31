export type UploadBatchStatus = "PENDING" | "PROCESSING" | "COMPLETED";

export interface UploadBatchSummary {
  id: number;
  originalFilename: string;
  fileFormat: string;
  totalRecords: number;
  pendingCount: number;
  validCount: number;
  invalidCount: number;
  softBounceCount: number;
  hardBounceCount: number;
  status: UploadBatchStatus;
  uploadedAt: string;
}

export type EmailRecordStatus =
  | "PENDING"
  | "VALID"
  | "INVALID"
  | "SOFT_BOUNCE"
  | "HARD_BOUNCE";

export interface EmailRecordResponse {
  id: number;
  email: string;
  status: EmailRecordStatus;
  invalidReason?: string;
  retryCount: number;
  validatedAt?: string;
  createdAt: string;
}

export interface EmailRecordQuery {
  status?: string;
  page?: number;
  size?: number;
}

export interface UploadAggregate {
  totalRecords: number;
  valid: number;
  invalid: number;
  softBounce: number;
  hardBounce: number;
  pending: number;
}
