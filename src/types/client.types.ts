export type ClientType = "ORGANIZATION" | "FREELANCER";

export type ClientStatus =
  | "ACTIVE"
  | "PENDING_APPROVAL"
  | "DISABLED"
  | "REJECTED"
  | string;

export interface ClientSummary {
  id: number;
  clientType: ClientType;
  companyName: string;
  username: string;
  officialEmail: string;
  phoneNumber: string;
  status: ClientStatus;
  createdAt: string;
  dailySendLimit: number;
  sentToday: number;
  monthlySendLimit: number;
  sentThisMonth: number;
}

export interface ClientListFilters {
  status?: string;
  type?: string;
}

/** A client's sending quota - shared across every user under that client. */
export interface QuotaSummary {
  dailySendLimit: number;
  sentToday: number;
  monthlySendLimit: number;
  sentThisMonth: number;
}
export interface UpdateClientQuotaPayload {
  dailySendLimit: number;
  monthlySendLimit: number;
}
