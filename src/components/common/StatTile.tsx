import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number;
  tone?: "default" | "good" | "bad" | "warn" | "info";
}

const TONE_CLASSES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-foreground",
  good: "text-emerald-600 dark:text-emerald-400",
  bad: "text-red-600 dark:text-red-400",
  warn: "text-amber-600 dark:text-amber-400",
  info: "text-sky-600 dark:text-sky-400",
};

const ACCENT_BAR: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "from-primary/60 to-primary/15",
  good: "from-emerald-500/60 to-emerald-500/15",
  bad: "from-red-500/60 to-red-500/15",
  warn: "from-amber-500/60 to-amber-500/15",
  info: "from-sky-500/60 to-sky-500/15",
};

export function StatTile({ label, value, tone = "default" }: StatTileProps) {
  return (
    <Card
      size="sm"
      className="relative overflow-hidden border-border/80 bg-card shadow-sm dark:border-border dark:bg-card"
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r",
          ACCENT_BAR[tone]
        )}
      />
      <CardContent className="px-4 py-3.5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          {label}
        </div>
        <div
          className={cn(
            "mt-1.5 text-2xl font-semibold tabular-nums tracking-tight",
            TONE_CLASSES[tone]
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
