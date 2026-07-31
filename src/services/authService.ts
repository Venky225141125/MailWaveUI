import { apiClient } from "@/lib/api";
import { AUTH_ENDPOINTS } from "@/constants/auth-endpoints.constants";
import type {
  AuthResponse,
  ClientRegisterPayload,
  FreelancerRegisterResponse,
} from "@/types";

export async function loginSuperAdmin(payload: {
  usernameOrEmail: string;
  password: string;
}): Promise<AuthResponse> {
  return apiClient<AuthResponse>(AUTH_ENDPOINTS.loginSuperAdmin, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function loginClient(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiClient<AuthResponse>(AUTH_ENDPOINTS.loginClient, {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiClient<AuthResponse>(AUTH_ENDPOINTS.loginUser, {
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
