export interface TimezoneOption {
  value: string;
  label: string;
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: "America/New_York", label: "US Eastern (ET)" },
  { value: "America/Chicago", label: "US Central (CT)" },
  { value: "America/Denver", label: "US Mountain (MT)" },
  { value: "America/Los_Angeles", label: "US Pacific (PT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
];

/**
 * Converts a `datetime-local` input value (e.g. "2026-08-06T14:30"), interpreted as wall-clock
 * time IN `timeZone`, to the correct UTC ISO instant string. There's no JS API that does this
 * directly, so this uses the standard "guess as UTC, format back through the target zone, correct
 * by the difference" trick - it's DST-correct year-round because Intl.DateTimeFormat resolves the
 * real IANA tz database, without needing a date-library dependency for one conversion.
 */
export function zonedDateTimeToUtcIso(dateTimeLocalValue: string, timeZone: string): string {
  const [datePart, timePart] = dateTimeLocalValue.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const asIfUtcMs = Date.UTC(year, month - 1, day, hour, minute);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(asIfUtcMs)).map((p) => [p.type, p.value])
  );
  const formattedBackMs = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  const offsetMs = formattedBackMs - asIfUtcMs;
  return new Date(asIfUtcMs - offsetMs).toISOString();
}

/**
 * Formats a backend `scheduledAt` value for display. The backend stores this field as bare
 * UTC-instant digits with no timezone suffix (e.g. "2026-08-20T09:00:00", not "...Z") - by
 * design, since it's a Java LocalDateTime and zonedDateTimeToUtcIso() above always converts to
 * UTC before sending it. `new Date("2026-08-20T09:00:00")` would otherwise be parsed as that
 * wall-clock time in the BROWSER's own local zone (per the JS Date spec, a date-time string
 * with no zone/offset is local, not UTC) - silently shifting the displayed time by the
 * viewer's UTC offset from what was actually selected. Appending "Z" makes the parse explicit.
 */
export function formatScheduledAt(value?: string | null): string {
  if (!value) return "—";
  const iso = value.endsWith("Z") ? value : `${value}Z`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return value;
  return (
    d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
  );
}
