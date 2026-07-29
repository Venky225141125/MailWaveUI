// Shared types mirroring docs/api-contract.md exactly.
// Do not add fields that aren't in the contract; if the UI needs more,
// compute it client-side instead of inventing a backend shape.

export type Role = "SUPER_ADMIN" | "CLIENT" | "USER";

export interface AuthResponse {
  token: string;
  role: Role;
  id: number;
  username: string;
  name?: string;
  mustResetPassword?: boolean;
}

export interface ApiErrorBody {
  errorCode: string;
  message: string;
  timestamp: string;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  website: string;
  createdAt: string;
}

export type ClientType = "ORGANIZATION" | "FREELANCER";

// Statuses observed across the contract's error codes
// (ACCOUNT_PENDING_APPROVAL / ACCOUNT_DISABLED / ACCOUNT_REJECTED) and the
// approve/reject endpoints. Kept as a union of the known values but typed
// loosely (string) at the call sites in case the backend adds more.
export type ClientStatus = "ACTIVE" | "PENDING_APPROVAL" | "DISABLED" | "REJECTED" | string;

export interface ClientSummary {
  id: number;
  clientType: ClientType;
  companyName: string;
  username: string;
  officialEmail: string;
  phoneNumber: string;
  status: ClientStatus;
  createdAt: string;
}

export type UserStatus = "ACTIVE" | "DISABLED" | string;

export interface UserSummary {
  id: number;
  username: string;
  officialEmail: string;
  status: UserStatus;
  createdAt: string;
}

// POST /api/client/users response: UserSummary + a one-time tempPassword,
// per the endpoint description in api-contract.md (not in the reusable
// "Shapes" section, but explicitly called out in the endpoint doc).
export interface CreateUserResponse extends UserSummary {
  tempPassword?: string;
  mustResetPassword?: boolean;
}

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

export type EmailRecordStatus = "PENDING" | "VALID" | "INVALID" | "SOFT_BOUNCE" | "HARD_BOUNCE";

export interface EmailRecordResponse {
  id: number;
  email: string;
  status: EmailRecordStatus;
  invalidReason?: string;
  retryCount: number;
  validatedAt?: string;
  createdAt: string;
}

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "SENT";

export interface CampaignSummary {
  id: number;
  name: string;
  status: CampaignStatus;
  recipientsCount: number;
  sentCount: number;
  openedCount: number;
  notOpenedCount: number;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
