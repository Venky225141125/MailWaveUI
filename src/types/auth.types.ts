export type Role = "SUPER_ADMIN" | "CLIENT" | "USER";

export interface AuthResponse {
  token: string;
  role: Role;
  id: number;
  username: string;
  name?: string;
  mustResetPassword?: boolean;
}

export interface Session {
  token: string;
  role: Role;
  id: number;
  username: string;
}

export interface FreelancerRegisterResponse {
  id: number;
  status: string;
  message: string;
}

export interface ClientRegisterPayload {
  companyName: string;
  companyWebsite: string;
  username: string;
  officialEmail: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email?: string;
  username?: string;
  password: string;
}

export interface OtpChallengeResponse {
  challengeToken: string;
  maskedEmail: string;
  expiresInSeconds: number;
}

export interface VerifyOtpPayload {
  challengeToken: string;
  code: string;
}

export interface ResendOtpPayload {
  challengeToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MessageResponse {
  message: string;
}
