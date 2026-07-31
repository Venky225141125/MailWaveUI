interface StatTileProps {
  label: string;
  value: string | number;
  tone?: "default" | "good" | "bad" | "warn" | "info";
}

const TONE_CLASSES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-[var(--text)]",
  good: "text-[var(--success)]",
  bad: "text-[var(--danger)]",
  warn: "text-[var(--warning)]",
  info: "text-[var(--info)]",
};

export function StatTile({ label, value, tone = "default" }: StatTileProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-sm)]">
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${TONE_CLASSES[tone]}`}>
        {value}
      </div>
    </div>
  );
}
