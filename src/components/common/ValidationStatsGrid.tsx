import type { UploadAggregate } from "@/types";
import { StatTile } from "./StatTile";

interface ValidationStatsGridProps {
  aggregate: UploadAggregate;
}

export function ValidationStatsGrid({ aggregate }: ValidationStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <StatTile label="Total Records" value={aggregate.totalRecords} />
      <StatTile label="Valid" value={aggregate.valid} tone="good" />
      <StatTile label="Invalid" value={aggregate.invalid} tone="bad" />
      <StatTile label="Soft Bounce" value={aggregate.softBounce} tone="warn" />
      <StatTile label="Hard Bounce" value={aggregate.hardBounce} tone="bad" />
      <StatTile label="Pending" value={aggregate.pending} tone="info" />
    </div>
  );
}
