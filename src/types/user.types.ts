export type UserStatus = "ACTIVE" | "DISABLED" | string;

export interface UserSummary {
  id: number;
  username: string;
  officialEmail: string;
  status: UserStatus;
  createdAt: string;
}

export interface CreateUserPayload {
  username: string;
  officialEmail: string;
}

export interface CreateUserResponse extends UserSummary {
  tempPassword?: string;
  mustResetPassword?: boolean;
}
