interface AlertProps {
  tone?: "error" | "success" | "info";
  message?: string | null;
  className?: string;
}

const TONE: Record<NonNullable<AlertProps["tone"]>, string> = {
  error:
    "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  success:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  info: "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
};

export function Alert({ tone = "error", message, className = "" }: AlertProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`rounded-[var(--radius-sm)] border px-3 py-2 text-sm ${TONE[tone]} ${className}`}
    >
      {message}
    </div>
  );
}

/** @deprecated Prefer Alert — kept for gradual migration */
export function FormError({ message }: { message?: string | null }) {
  return <Alert tone="error" message={message} />;
}

/** @deprecated Prefer Alert — kept for gradual migration */
export function FormSuccess({ message }: { message?: string | null }) {
  return <Alert tone="success" message={message} />;
}
