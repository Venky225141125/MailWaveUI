import { getToken } from "@/lib/auth/session";
import { ApiError, toApiError } from "./errors";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable body, or FormData for multipart requests. */
  body?: unknown;
  /** Attach Authorization: Bearer. Defaults to true. */
  auth?: boolean;
}

/**
 * Central HTTP gateway for all domain services.
 * Resolves NEXT_PUBLIC_API_BASE_URL, attaches JWT, normalizes contract errors.
 */
export async function apiClient<T>(
  path: string,
  opts: ApiFetchOptions = {}
): Promise<T> {
  const { body, headers, auth = true, ...rest } = opts;

  const finalHeaders = new Headers(headers);
  let finalBody: BodyInit | undefined;

  if (body instanceof FormData) {
    finalBody = body;
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
    throw toApiError(data, res.status, res.statusText);
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

export { ApiError };
export { apiClient as apiFetch };
