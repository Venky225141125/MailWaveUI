export const AUTH_ENDPOINTS = {
  loginSuperAdmin: "/auth/login/super-admin",
  loginClient: "/auth/login/client",
  loginUser: "/auth/login/user",
  registerClient: "/auth/register/client",
  registerFreelancer: "/auth/register/freelancer",
  otpVerify: "/auth/otp/verify",
  otpResend: "/auth/otp/resend",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const;
