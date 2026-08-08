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
