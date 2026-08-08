import type { UploadAggregate, UploadBatchSummary } from "@/types";

export function aggregateUploadBatches(
  batches: UploadBatchSummary[]
): UploadAggregate {
  return {
    totalRecords: batches.reduce((s, b) => s + b.totalRecords, 0),
    valid: batches.reduce((s, b) => s + b.validCount, 0),
    invalid: batches.reduce((s, b) => s + b.invalidCount, 0),
    softBounce: batches.reduce((s, b) => s + b.softBounceCount, 0),
    hardBounce: batches.reduce((s, b) => s + b.hardBounceCount, 0),
    pending: batches.reduce((s, b) => s + b.pendingCount, 0),
  };
}

export function isAcceptedUploadFile(
  fileName: string,
  extensions: readonly string[]
): boolean {
  const lower = fileName.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext));
}

export function buildQueryString(
  params: Record<string, string | number | undefined | null>
): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    qs.set(key, String(value));
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}
