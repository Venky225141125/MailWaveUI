import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number;
  tone?: "default" | "good" | "bad" | "warn" | "info";
}

const TONE_CLASSES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-[#0f172a]",
  good: "text-[#16a34a]",
  bad: "text-[#ef4444]",
  warn: "text-[#d97706]",
  info: "text-[#0284c7]",
};


const ACCENT_BAR: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "from-[#2563eb]/50 to-[#2563eb]/10",
  good: "from-[#16a34a]/50 to-[#16a34a]/10",
  bad: "from-[#ef4444]/50 to-[#ef4444]/10",
  warn: "from-[#f59e0b]/50 to-[#f59e0b]/10",
  info: "from-[#0ea5e9]/50 to-[#0ea5e9]/10",
};


export function StatTile({ label, value, tone = "default" }: StatTileProps) {
  return (
    <Card
      size="sm"
      className="relative overflow-hidden border-border/80 bg-card/90 shadow-sm"
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
