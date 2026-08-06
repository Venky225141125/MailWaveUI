export const SUPER_ADMIN_ENDPOINTS = {
  organizations: "/superadmin/organizations",
  clients: "/superadmin/clients",
  client: (id: string | number) => `/superadmin/clients/${id}`,
  approveClient: (id: string | number) => `/superadmin/clients/${id}/approve`,
  rejectClient: (id: string | number) => `/superadmin/clients/${id}/reject`,
  activateClient: (id: string | number) => `/superadmin/clients/${id}/activate`,
  deactivateClient: (id: string | number) =>
    `/superadmin/clients/${id}/deactivate`,
  clientUsers: (id: string | number) => `/superadmin/clients/${id}/users`,
  activateUser: (userId: string | number) => `/superadmin/users/${userId}/activate`,
  deactivateUser: (userId: string | number) =>
    `/superadmin/users/${userId}/deactivate`,
  userUploads: (userId: string | number) =>
    `/superadmin/users/${userId}/uploads`,
  uploadRecords: (batchId: string | number) =>
    `/superadmin/uploads/${batchId}/records`,
} as const;
