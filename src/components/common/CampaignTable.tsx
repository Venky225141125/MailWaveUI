import type { CampaignSummary } from "@/types";
import Link from "next/link";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime, formatNumber } from "@/lib/helpers";

interface CampaignTableProps {
  campaigns: CampaignSummary[];
  loading?: boolean;
  hrefForCampaign?: (campaign: CampaignSummary) => string;
  emptyMessage?: string;
}

export function CampaignTable({
  campaigns,
  loading,
  hrefForCampaign,
  emptyMessage = "No campaigns yet.",
}: CampaignTableProps) {
  return (
    <DataTable
      columns={[
        "Name",
        "Status",
        "Recipients",
        "Sent",
        "Opened",
        "Not opened",
        "Created",
      ]}
      loading={loading}
      empty={!loading && campaigns.length === 0}
      emptyMessage={emptyMessage}
      minWidth="860px"
    >
      {campaigns.map((campaign) => (
        <TableRow key={campaign.id}>
          <TableCell className="px-4 py-3.5 font-medium">
            {hrefForCampaign ? (
              <Link
                href={hrefForCampaign(campaign)}
                className="text-primary hover:underline"
              >
                {campaign.name}
              </Link>
            ) : (
              campaign.name
            )}
          </TableCell>
          <TableCell className="px-4 py-3.5">
            <StatusBadge status={campaign.status} />
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(campaign.recipientsCount)}
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(campaign.sentCount)}
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(campaign.openedCount)}
          </TableCell>
          <TableCell className="px-4 py-3.5 tabular-nums text-muted-foreground">
            {formatNumber(campaign.notOpenedCount)}
          </TableCell>
          <TableCell className="px-4 py-3.5 text-muted-foreground">
            {formatDateTime(campaign.createdAt)}
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
}
