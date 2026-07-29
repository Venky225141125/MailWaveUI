interface StatTileProps {
  label: string;
  value: string | number;
  tone?: "default" | "good" | "bad" | "warn" | "info";
}

const TONE_CLASSES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-zinc-900 dark:text-zinc-50",
  good: "text-emerald-600 dark:text-emerald-400",
  bad: "text-red-600 dark:text-red-400",
  warn: "text-amber-600 dark:text-amber-400",
  info: "text-sky-600 dark:text-sky-400",
};

export function StatTile({ label, value, tone = "default" }: StatTileProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${TONE_CLASSES[tone]}`}>
        {value}
      </div>
    </div>
  );
}
