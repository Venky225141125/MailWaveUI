export const ROUTES = {
  home: "/",
  login: {
    superAdmin: "/login/super-admin",
    client: "/login/client",
    user: "/login/user",
  },
  register: {
    client: "/register/client",
    freelancer: "/register/freelancer",
  },
  superAdmin: {
    dashboard: "/super-admin/dashboard",
    organizations: "/super-admin/organizations",
    clients: "/super-admin/clients",
    client: (id: string | number) => `/super-admin/clients/${id}`,
    clientUsers: (id: string | number) => `/super-admin/clients/${id}/users`,
    userUploads: (userId: string | number) =>
      `/super-admin/users/${userId}/uploads`,
    uploadRecords: (batchId: string | number) =>
      `/super-admin/uploads/${batchId}/records`,
  },
  client: {
    dashboard: "/client/dashboard",
    users: "/client/users",
    newUser: "/client/users/new",
    user: (userId: string | number) => `/client/users/${userId}`,
  },
  user: {
    dashboard: "/user/dashboard",
    uploads: "/user/uploads",
    newUpload: "/user/uploads/new",
    upload: (batchId: string | number) => `/user/uploads/${batchId}`,
    campaigns: "/user/campaigns",
    newCampaign: "/user/campaigns/new",
    campaign: (id: string | number) => `/user/campaigns/${id}`,
  },
} as const;
