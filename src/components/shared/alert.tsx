import * as React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface FormAlertProps {
  tone?: "error" | "success" | "info";
  message?: string | null;
  className?: string;
}

/** Simple message alert used across pages. */
export function FormAlert({
  tone = "error",
  message,
  className,
}: FormAlertProps) {
  if (!message) return null;

  return (
    <Alert
      variant={tone === "error" ? "destructive" : "default"}
      className={cn(
        tone === "success" &&
          "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
        tone === "info" &&
          "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
        className
      )}
    >
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/** @deprecated Prefer FormAlert */
export function FormError({ message }: { message?: string | null }) {
  return <FormAlert tone="error" message={message} />;
}

/** @deprecated Prefer FormAlert */
export function FormSuccess({ message }: { message?: string | null }) {
  return <FormAlert tone="success" message={message} />;
}

export { FormAlert as Alert };
