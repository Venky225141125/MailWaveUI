"use client";

import { useEffect, useRef } from "react";
import { toastByTone, type ToastTone } from "@/lib/helpers/toast.utils";

/**
 * Shows a Sonner toast when `message` becomes non-empty.
 * Skips duplicate toasts for the same message string.
 */
export function useToastOnError(
  message: string | null | undefined,
  tone: ToastTone = "error"
) {
  const lastRef = useRef<string | null>(null);

  useEffect(() => {
    if (!message || message === lastRef.current) return;
    lastRef.current = message;
    toastByTone(tone, message);
  }, [message, tone]);
}
