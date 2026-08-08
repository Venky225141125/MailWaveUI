import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";
type Appearance = "soft" | "solid";

const STATUS_TONE: Record<string, Tone> = {
  VALID: "success",
  ACTIVE: "success",
  SENT: "success",
  COMPLETED: "success",

  PENDING: "warning",
  PENDING_APPROVAL: "warning",
  DRAFT: "neutral",
  SOFT_BOUNCE: "warning",

  PROCESSING: "info",
  SCHEDULED: "info",
  SENDING: "info",

  INVALID: "danger",
  HARD_BOUNCE: "danger",
  REJECTED: "danger",
  DISABLED: "danger",
  INACTIVE: "danger",

  ORGANIZATION: "info",
  FREELANCER: "neutral",
};

/** Solid badges for bounce / send outcomes (matches design kit) */
const SOLID_STATUSES = new Set([
  "HARD_BOUNCE",
  "SOFT_BOUNCE",
  "SENT",
  "INVALID",
  "REJECTED",
]);

const SOFT_CLASSES: Record<Tone, string> = {
  success: "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]",
  warning: "border-[#fde68a] bg-[#fffbeb] text-[#b45309]",
  danger: "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]",
  info: "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
  neutral: "border-[#e2e8f0] bg-[#f8fafc] text-[#475569]",
};

const SOLID_CLASSES: Record<Tone, string> = {
  success: "border-transparent bg-[#16a34a] text-white",
  warning: "border-transparent bg-[#f59e0b] text-white",
  danger: "border-transparent bg-[#ef4444] text-white",
  info: "border-transparent bg-[#0ea5e9] text-white",
  neutral: "border-transparent bg-[#64748b] text-white",
};

const DOT_CLASSES: Record<Tone, string> = {
  success: "bg-[#16a34a]",
  warning: "bg-[#f59e0b]",
  danger: "bg-[#ef4444]",
  info: "bg-[#0ea5e9]",
  neutral: "bg-[#94a3b8]",
};

function friendlyLabel(status: string) {
  if (status === "ACTIVE") return "Active";
  if (status === "DISABLED" || status === "INACTIVE") return "Inactive";
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function StatusBadge({
  status,
  className,
  appearance,
}: {
  status: string;
  className?: string;
  appearance?: Appearance;
}) {
  const tone = STATUS_TONE[status] ?? "neutral";
  const style: Appearance =
    appearance ?? (SOLID_STATUSES.has(status) ? "solid" : "soft");

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1.5 rounded-full px-2.5 text-[11px] font-semibold tracking-wide",
        style === "solid" ? SOLID_CLASSES[tone] : SOFT_CLASSES[tone],
        className
      )}
    >
      {style === "soft" ? (
        <span
          aria-hidden
          className={cn("size-1.5 rounded-full", DOT_CLASSES[tone])}
        />
      ) : null}
      {friendlyLabel(status)}
    </Badge>
  );
}
