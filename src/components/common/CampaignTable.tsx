import type { CampaignSummary } from "@/types";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime, formatNumber } from "@/lib/utils";

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
        <tr key={campaign.id} className="hover:bg-[var(--surface-muted)]">
          <td className="px-4 py-2.5 font-medium text-[var(--text)]">
            {hrefForCampaign ? (
              <Link
                href={hrefForCampaign(campaign)}
                className="text-[var(--brand)] hover:underline"
              >
                {campaign.name}
              </Link>
            ) : (
              campaign.name
            )}
          </td>
          <td className="px-4 py-2.5">
            <StatusBadge status={campaign.status} />
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(campaign.recipientsCount)}
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(campaign.sentCount)}
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(campaign.openedCount)}
          </td>
          <td className="px-4 py-2.5 tabular-nums text-[var(--text-muted)]">
            {formatNumber(campaign.notOpenedCount)}
          </td>
          <td className="px-4 py-2.5 text-[var(--text-muted)]">
            {formatDateTime(campaign.createdAt)}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
