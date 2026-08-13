import { toast as sonner } from "sonner";
import { ApiError } from "@/lib/api";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export type ToastTone = "success" | "error" | "info" | "warning";

/** Show an error toast. */
export function toastError(message: string, options?: { description?: string }) {
  sonner.error(message, options);
}

/** Show a success toast. */
export function toastSuccess(message: string, options?: { description?: string }) {
  sonner.success(message, options);
}

/** Show an info toast. */
export function toastInfo(message: string, options?: { description?: string }) {
  sonner.info(message, options);
}

/** Show a warning toast. */
export function toastWarning(message: string, options?: { description?: string }) {
  sonner.warning(message, options);
}

/** Map ApiError (or unknown) to a user-facing message and toast it. */
export function toastApiError(
  err: unknown,
  fallback: string = GENERIC_ERROR
): string {
  const message = err instanceof ApiError ? err.message : fallback;
  toastError(message);
  return message;
}

/** Dispatch a toast by tone — useful when tone is dynamic. */
export function toastByTone(tone: ToastTone, message: string) {
  switch (tone) {
    case "success":
      toastSuccess(message);
      break;
    case "info":
      toastInfo(message);
      break;
    case "warning":
      toastWarning(message);
      break;
    default:
      toastError(message);
  }
}

export { sonner as toast };
