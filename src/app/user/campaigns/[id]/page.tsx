"use client";

import { useParams } from "next/navigation";
import { getCampaign } from "@/services/userCampaignService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { StatTile } from "@/components/common/StatTile";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailList, DetailRow } from "@/components/shared/detail-list";
import { DetailSkeleton } from "@/components/common/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/helpers";
import { formatScheduledAt } from "@/lib/timezone";
import { ROUTES } from "@/constants/routes.constants";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: campaign, loading, error } = useAsyncData(
    () => getCampaign(params.id),
    [params.id]
  );

  if (loading) return <DetailSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <Alert message={error} />
      {campaign ? (
        <>
          <PageHeader
            title={campaign.name}
            backHref={ROUTES.user.campaigns}
            backLabel="All campaigns"
            action={<StatusBadge status={campaign.status} />}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile
              label="Recipients / Sent"
              value={`${campaign.recipientsCount} / ${campaign.sentCount}`}
            />
            <StatTile label="Opened" value={campaign.openedCount} tone="good" />
            <StatTile
              label="Not Opened"
              value={campaign.notOpenedCount}
              tone="warn"
            />
            <StatTile label="Status" value={campaign.status} />
          </div>
          <DetailList>
            <DetailRow label="Created">
              {formatDateTime(campaign.createdAt)}
            </DetailRow>
            <DetailRow label="Scheduled At">
              {formatScheduledAt(campaign.scheduledAt)}
            </DetailRow>
            <DetailRow label="Sent At">
              {formatDateTime(campaign.sentAt)}
            </DetailRow>
            <DetailRow label="Subject">{campaign.subject}</DetailRow>
            <DetailRow label="From Name">{campaign.fromName}</DetailRow>
          </DetailList>
          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                What was written for this campaign at the time it was created/scheduled.
              </p>
              <div
                className="rounded-lg border border-foreground/10 bg-background p-4 text-sm [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">Campaign not found.</p>
      )}
    </div>
  );
}
