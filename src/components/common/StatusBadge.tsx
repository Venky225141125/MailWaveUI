import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<string, string> = {
  VALID: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  ACTIVE: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  SENT: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  COMPLETED: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",

  PENDING: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  PENDING_APPROVAL: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  DRAFT: "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",

  PROCESSING: "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  SCHEDULED: "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  SENDING: "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",

  SOFT_BOUNCE: "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",

  INVALID: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  HARD_BOUNCE: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  REJECTED: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  DISABLED: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full font-medium",
        STATUS_CLASSES[status] ??
          "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      )}
    >
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
