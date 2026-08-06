export const USER_ENDPOINTS = {
  uploads: "/user/uploads",
  upload: (batchId: string | number) => `/user/uploads/${batchId}`,
  uploadRecords: (batchId: string | number) =>
    `/user/uploads/${batchId}/records`,
  campaigns: "/user/campaigns",
  campaign: (id: string | number) => `/user/campaigns/${id}`,
  testSendCampaign: "/user/campaigns/test-send",
} as const;
