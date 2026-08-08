import type { ApiErrorBody } from "@/types";

export class ApiError extends Error {
  errorCode: string;
  status: number;

  constructor(errorCode: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.errorCode = errorCode;
    this.status = status;
  }
}

export function toApiError(data: unknown, status: number, statusText: string): ApiError {
  const errBody = data as Partial<ApiErrorBody> | undefined;
  return new ApiError(
    errBody?.errorCode ?? `HTTP_${status}`,
    errBody?.message ?? statusText ?? "Request failed",
    status
  );
}
