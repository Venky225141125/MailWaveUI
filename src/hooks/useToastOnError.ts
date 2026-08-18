"use client";

import { useEffect, useRef } from "react";
import { toastError } from "@/lib/helpers/toast.utils";

/** Shows a Sonner error toast whenever `error` changes to a new message. */
export function useToastOnError(error: string | null | undefined) {
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!error) {
      last.current = null;
      return;
    }
    if (last.current === error) return;
    last.current = error;
    toastError(error);
  }, [error]);
}
