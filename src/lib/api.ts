import { getToken } from "./auth";
import type { ApiErrorBody } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

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

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable body, or a FormData instance for multipart requests. */
  body?: unknown;
  /** Attach the Authorization: Bearer header. Defaults to true. */
  auth?: boolean;
}

/**
 * Small typed fetch wrapper around the backend at NEXT_PUBLIC_API_BASE_URL.
 * Attaches the JWT (if present) and normalizes the error shape from
 * docs/api-contract.md: { errorCode, message, timestamp }.
 */
export async function apiFetch<T>(
  path: string,
  opts: ApiFetchOptions = {}
): Promise<T> {
  const { body, headers, auth = true, ...rest } = opts;

  const finalHeaders = new Headers(headers);
  let finalBody: BodyInit | undefined;

  if (body instanceof FormData) {
    finalBody = body;
    // Let the browser set the multipart boundary itself.
  } else if (body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
    finalBody = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: finalBody,
    });
  } catch {
    throw new ApiError(
      "NETWORK_ERROR",
      `Could not reach the backend at ${API_BASE_URL}. Is it running?`,
      0
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? safeJsonParse(text) : undefined;

  if (!res.ok) {
    const errBody = data as Partial<ApiErrorBody> | undefined;
    throw new ApiError(
      errBody?.errorCode ?? `HTTP_${res.status}`,
      errBody?.message ?? res.statusText ?? "Request failed",
      res.status
    );
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
