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

/** Matches the live create-campaign request body used by the UI. */
export interface CreateCampaignPayload {
  name: string;
  batchId: number;
  subject: string;
  fromName: string;
  bodyHtml: string;
  scheduledAt?: string;
}

export interface SendTestEmailPayload {
  subject: string;
  fromName: string;
  bodyHtml: string;
}

export interface TestEmailSentResponse {
  sentTo: string;
}
