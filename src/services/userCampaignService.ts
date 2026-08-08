import { apiClient } from "@/lib/api";
import { USER_ENDPOINTS } from "@/constants/user-endpoints.constants";
import type {
  CampaignSummary,
  CreateCampaignPayload,
  SendTestEmailPayload,
  TestEmailSentResponse,
} from "@/types";

export async function listCampaigns(): Promise<CampaignSummary[]> {
  return apiClient<CampaignSummary[]>(USER_ENDPOINTS.campaigns);
}

export async function getCampaign(id: string | number): Promise<CampaignSummary> {
  return apiClient<CampaignSummary>(USER_ENDPOINTS.campaign(id));
}

export async function createCampaign(
  payload: CreateCampaignPayload
): Promise<CampaignSummary> {
  return apiClient<CampaignSummary>(USER_ENDPOINTS.campaigns, {
    method: "POST",
    body: payload,
  });
}

export async function sendTestEmail(
  payload: SendTestEmailPayload
): Promise<TestEmailSentResponse> {
  return apiClient<TestEmailSentResponse>(USER_ENDPOINTS.testSendCampaign, {
    method: "POST",
    body: payload,
  });
}
