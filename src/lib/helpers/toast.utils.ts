import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export type ToastTone = "error" | "success" | "info" | "warning";

export function toastError(message: string, description?: string) {
  return toast.error(message, description ? { description } : undefined);
}

export function toastSuccess(message: string, description?: string) {
  return toast.success(message, description ? { description } : undefined);
}

export function toastInfo(message: string, description?: string) {
  return toast.info(message, description ? { description } : undefined);
}

export function toastWarning(message: string, description?: string) {
  return toast.warning(message, description ? { description } : undefined);
}

export function toastLoading(message: string, description?: string) {
  return toast.loading(message, description ? { description } : undefined);
}

export function toastApiError(err: unknown, fallback = GENERIC_ERROR) {
  const message = err instanceof ApiError ? err.message : fallback;
  toast.error(message);
  return message;
}

export function toastByTone(
  tone: ToastTone,
  message: string,
  description?: string
) {
  switch (tone) {
    case "success":
      return toastSuccess(message, description);
    case "info":
      return toastInfo(message, description);
    case "warning":
      return toastWarning(message, description);
    default:
      return toastError(message, description);
  }
}
