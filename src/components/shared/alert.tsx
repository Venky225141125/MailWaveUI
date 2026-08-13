"use client";

import { useEffect } from "react";
import { toastByTone, type ToastTone } from "@/lib/helpers/toast.utils";

interface FormAlertProps {
  tone?: ToastTone;
  message?: string | null;
  className?: string;
}

/**
 * @deprecated Use `toastError`, `toastSuccess`, etc. from `@/lib/helpers/toast.utils`.
 * Renders nothing — shows a Sonner toast when `message` is set.
 */
export function FormAlert({
  tone = "error",
  message,
}: FormAlertProps) {
  useEffect(() => {
    if (message) toastByTone(tone, message);
  }, [message, tone]);

  return null;
}

/** @deprecated Use toast helpers from `@/lib/helpers/toast.utils`. */
export function FormError({ message }: { message?: string | null }) {
  return <FormAlert tone="error" message={message} />;
}

/** @deprecated Use toast helpers from `@/lib/helpers/toast.utils`. */
export function FormSuccess({ message }: { message?: string | null }) {
  return <FormAlert tone="success" message={message} />;
}

export { FormAlert as Alert };
