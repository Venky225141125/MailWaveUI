/** Shared placeholder copy for form fields across the app. */
export const FORM_PLACEHOLDERS = {
  auth: {
    username: "Enter your username",
    email: "you@company.com",
    password: "Enter your password",
    otp: "000000",
    newPassword: "Create a strong password",
    confirmPassword: "Re-enter your password",
  },
  clientRegister: {
    companyName: "Acme Corporation",
    companyWebsite: "https://example.com",
    username: "Choose a username",
    officialEmail: "admin@company.com",
    phoneNumber: "+91 98765 43210",
    password: "Min. 8 characters",
    confirmPassword: "Repeat your password",
  },
  freelancerRegister: {
    fullName: "Jane Doe",
    username: "Choose a username",
    email: "you@email.com",
    phoneNumber: "+91 98765 43210",
    password: "Min. 8 characters",
    confirmPassword: "Repeat your password",
  },
  user: {
    campaignName: "e.g. March product launch",
    subject: "Subject line recipients will see",
    fromName: "e.g. Acme Marketing",
    uploadFile: "Choose a CSV or Excel file",
  },
  client: {
    username: "New user's username",
    email: "user@company.com",
    tempPassword: "Temporary password for first login",
  },
  superAdmin: {
    organizationName: "Acme Corporation",
    organizationDomain: "https://example.com",
  },
} as const;
