import { apiClient } from "@/lib/api";
import { AUTH_ENDPOINTS } from "@/constants/auth-endpoints.constants";
import type {
  AuthResponse,
  ClientRegisterPayload,
  ForgotPasswordPayload,
  FreelancerRegisterResponse,
  MessageResponse,
  OtpChallengeResponse,
  ResendOtpPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "@/types";

export async function loginSuperAdmin(payload: {
  usernameOrEmail: string;
  password: string;
}): Promise<OtpChallengeResponse> {
  return apiClient<OtpChallengeResponse>(AUTH_ENDPOINTS.loginSuperAdmin, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function loginClient(payload: {
  email: string;
  password: string;
}): Promise<OtpChallengeResponse> {
  return apiClient<OtpChallengeResponse>(AUTH_ENDPOINTS.loginClient, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<OtpChallengeResponse> {
  return apiClient<OtpChallengeResponse>(AUTH_ENDPOINTS.loginUser, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function verifyOtp(
  payload: VerifyOtpPayload
): Promise<AuthResponse> {
  return apiClient<AuthResponse>(AUTH_ENDPOINTS.otpVerify, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function resendOtp(
  payload: ResendOtpPayload
): Promise<OtpChallengeResponse> {
  return apiClient<OtpChallengeResponse>(AUTH_ENDPOINTS.otpResend, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<MessageResponse> {
  return apiClient<MessageResponse>(AUTH_ENDPOINTS.forgotPassword, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<MessageResponse> {
  return apiClient<MessageResponse>(AUTH_ENDPOINTS.resetPassword, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function registerClient(
  payload: ClientRegisterPayload
): Promise<AuthResponse> {
  return apiClient<AuthResponse>(AUTH_ENDPOINTS.registerClient, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function registerFreelancer(
  formData: FormData
): Promise<FreelancerRegisterResponse> {
  return apiClient<FreelancerRegisterResponse>(
    AUTH_ENDPOINTS.registerFreelancer,
    {
      method: "POST",
      body: formData,
      auth: false,
    }
  );
}
