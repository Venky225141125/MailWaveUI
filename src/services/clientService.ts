import { apiClient } from "@/lib/api";
import { CLIENT_ENDPOINTS } from "@/constants/client-endpoints.constants";
import type {
  CampaignSummary,
  CreateUserPayload,
  CreateUserResponse,
  UploadBatchSummary,
  UserSummary,
} from "@/types";

export async function listUsers(): Promise<UserSummary[]> {
  return apiClient<UserSummary[]>(CLIENT_ENDPOINTS.users);
}

export async function createUser(
  payload: CreateUserPayload
): Promise<CreateUserResponse> {
  return apiClient<CreateUserResponse>(CLIENT_ENDPOINTS.users, {
    method: "POST",
    body: payload,
  });
}

export async function listUserUploads(
  userId: string | number
): Promise<UploadBatchSummary[]> {
  return apiClient<UploadBatchSummary[]>(CLIENT_ENDPOINTS.userUploads(userId));
}

export async function listUserCampaigns(
  userId: string | number
): Promise<CampaignSummary[]> {
  return apiClient<CampaignSummary[]>(CLIENT_ENDPOINTS.userCampaigns(userId));
}
