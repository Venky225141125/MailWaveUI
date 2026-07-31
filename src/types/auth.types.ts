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
