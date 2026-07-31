export const SUPER_ADMIN_ENDPOINTS = {
  organizations: "/superadmin/organizations",
  clients: "/superadmin/clients",
  client: (id: string | number) => `/superadmin/clients/${id}`,
  approveClient: (id: string | number) => `/superadmin/clients/${id}/approve`,
  rejectClient: (id: string | number) => `/superadmin/clients/${id}/reject`,
  clientUsers: (id: string | number) => `/superadmin/clients/${id}/users`,
  userUploads: (userId: string | number) =>
    `/superadmin/users/${userId}/uploads`,
  uploadRecords: (batchId: string | number) =>
    `/superadmin/uploads/${batchId}/records`,
} as const;
