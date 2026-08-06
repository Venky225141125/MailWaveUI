import { apiClient } from "@/lib/api";
import { SUPER_ADMIN_ENDPOINTS } from "@/constants/super-admin-endpoints.constants";
import { buildQueryString } from "@/lib/utils";
import type {
  ClientListFilters,
  ClientSummary,
  CreateOrganizationPayload,
  EmailRecordQuery,
  EmailRecordResponse,
  OrganizationResponse,
  Page,
  UploadBatchSummary,
  UserSummary,
} from "@/types";

export async function listOrganizations(): Promise<OrganizationResponse[]> {
  return apiClient<OrganizationResponse[]>(SUPER_ADMIN_ENDPOINTS.organizations);
}

export async function createOrganization(
  payload: CreateOrganizationPayload
): Promise<OrganizationResponse> {
  return apiClient<OrganizationResponse>(SUPER_ADMIN_ENDPOINTS.organizations, {
    method: "POST",
    body: payload,
  });
}

export async function listClients(
  filters: ClientListFilters = {}
): Promise<ClientSummary[]> {
  const qs = buildQueryString({
    status: filters.status,
    type: filters.type,
  });
  return apiClient<ClientSummary[]>(`${SUPER_ADMIN_ENDPOINTS.clients}${qs}`);
}

export async function getClient(id: string | number): Promise<ClientSummary> {
  return apiClient<ClientSummary>(SUPER_ADMIN_ENDPOINTS.client(id));
}

export async function approveClient(id: string | number): Promise<ClientSummary> {
  return apiClient<ClientSummary>(SUPER_ADMIN_ENDPOINTS.approveClient(id), {
    method: "POST",
  });
}

export async function rejectClient(id: string | number): Promise<ClientSummary> {
  return apiClient<ClientSummary>(SUPER_ADMIN_ENDPOINTS.rejectClient(id), {
    method: "POST",
  });
}

export async function activateClient(id: string | number): Promise<ClientSummary> {
  return apiClient<ClientSummary>(SUPER_ADMIN_ENDPOINTS.activateClient(id), {
    method: "POST",
  });
}

export async function deactivateClient(id: string | number): Promise<ClientSummary> {
  return apiClient<ClientSummary>(SUPER_ADMIN_ENDPOINTS.deactivateClient(id), {
    method: "POST",
  });
}

export async function activateUser(userId: string | number): Promise<UserSummary> {
  return apiClient<UserSummary>(SUPER_ADMIN_ENDPOINTS.activateUser(userId), {
    method: "POST",
  });
}

export async function deactivateUser(userId: string | number): Promise<UserSummary> {
  return apiClient<UserSummary>(SUPER_ADMIN_ENDPOINTS.deactivateUser(userId), {
    method: "POST",
  });
}

export async function listClientUsers(
  clientId: string | number
): Promise<UserSummary[]> {
  return apiClient<UserSummary[]>(SUPER_ADMIN_ENDPOINTS.clientUsers(clientId));
}

export async function listUserUploads(
  userId: string | number
): Promise<UploadBatchSummary[]> {
  return apiClient<UploadBatchSummary[]>(
    SUPER_ADMIN_ENDPOINTS.userUploads(userId)
  );
}

export async function listUploadRecords(
  batchId: string | number,
  query: EmailRecordQuery = {}
): Promise<Page<EmailRecordResponse>> {
  const qs = buildQueryString({
    status: query.status,
    page: query.page ?? 0,
    size: query.size ?? 20,
  });
  return apiClient<Page<EmailRecordResponse>>(
    `${SUPER_ADMIN_ENDPOINTS.uploadRecords(batchId)}${qs}`
  );
}
