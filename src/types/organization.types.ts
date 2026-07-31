export interface OrganizationResponse {
  id: number;
  name: string;
  website: string;
  createdAt: string;
}

export interface CreateOrganizationPayload {
  name: string;
  website: string;
}
