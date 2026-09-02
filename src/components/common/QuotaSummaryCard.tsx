"use client";

import { useAsyncData } from "@/hooks/useAsyncData";
import { getQuota } from "@/services/userUploadService";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Shows the logged-in user's client-wide sending quota. Self-contained (fetches its own data)
 * so it can be dropped into the dashboard and the new-campaign page without prop drilling -
 * shown before scheduling a campaign so a user isn't surprised by a QUOTA_PAUSED mid-send. */
export function QuotaSummaryCard() {
  const { data: quota, loading } = useAsyncData(() => getQuota(), []);

  if (loading || !quota) return null;

  const dailyRemaining = quota.dailySendLimit - quota.sentToday;
  const dailyPct = Math.min(100, (quota.sentToday / quota.dailySendLimit) * 100);
  const isExhausted = dailyRemaining <= 0;
  const isWarn = !isExhausted && dailyPct >= 80;

  return (
    <Card
      size="sm"
      className={cn(
        "border-border/80",
        isExhausted && "border-red-300 dark:border-red-900"
      )}
    >
      <CardContent className="px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Daily sending quota
          </span>
          <span
            className={cn(
              "text-xs font-medium",
              isExhausted
                ? "text-red-600 dark:text-red-400"
                : isWarn
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
            )}
          >
            {isExhausted
              ? "Limit reached for today"
              : `${dailyRemaining} left today`}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isExhausted
                  ? "bg-red-500"
                  : isWarn
                    ? "bg-amber-500"
                    : "bg-primary"
              )}
              style={{ width: `${dailyPct}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
            {quota.sentToday} / {quota.dailySendLimit}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          This month: {quota.sentThisMonth} / {quota.monthlySendLimit} sent
        </p>
      </CardContent>
    </Card>
  );
}
