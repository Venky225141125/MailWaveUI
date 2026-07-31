const STATUS_CLASSES: Record<string, string> = {
  VALID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  SENT: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  COMPLETED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",

  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  PENDING_APPROVAL: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",

  PROCESSING: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  SCHEDULED: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  SENDING: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",

  SOFT_BOUNCE: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",

  INVALID: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  HARD_BOUNCE: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  DISABLED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const DEFAULT_CLASS =
  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_CLASSES[status] ?? DEFAULT_CLASS;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
