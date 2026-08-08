export const CLIENT_ENDPOINTS = {
  users: "/client/users",
  userUploads: (userId: string | number) =>
    `/client/users/${userId}/uploads`,
  userCampaigns: (userId: string | number) =>
    `/client/users/${userId}/campaigns`,
} as const;
