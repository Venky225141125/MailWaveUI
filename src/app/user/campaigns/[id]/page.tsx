"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCampaign } from "@/services/userCampaignService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useToastOnError } from "@/hooks/useToastOnError";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/common/StatTile";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailList, DetailRow } from "@/components/shared/detail-list";
import { DetailSkeleton } from "@/components/common/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/helpers";
import { formatScheduledAt } from "@/lib/timezone";
import { ROUTES } from "@/constants/routes.constants";
import type { CampaignSummary } from "@/types";

const LIVE_STATUSES = new Set(["SCHEDULED", "SENDING"]);
const POLL_INTERVAL_MS = 3000;

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: initialCampaign, loading, error } = useAsyncData(
    () => getCampaign(params.id),
    [params.id]
  );
  useToastOnError(error);

  // Sent/opened counts change while a campaign is actively sending, but the initial fetch above
  // only ever runs once - without this, the page would only ever show a snapshot from the moment
  // it was opened, not the running total, until the user manually reloads the page. Kept as
  // separate state (not routed through useAsyncData's own reload) so a poll tick never re-shows
  // the full-page loading skeleton.
  const [liveCampaign, setLiveCampaign] = useState<CampaignSummary | null>(null);
  const campaign = liveCampaign ?? initialCampaign;
  const isLive = campaign ? LIVE_STATUSES.has(campaign.status) : false;

  useEffect(() => {
    setLiveCampaign(null);
  }, [params.id]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(async () => {
      try {
        setLiveCampaign(await getCampaign(params.id));
      } catch {
        // Transient poll failure - just keep showing the last known-good data and try again
        // on the next tick.
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isLive, params.id]);

  if (loading) return <DetailSkeleton />;

  return (
    <div className="flex flex-col gap-6">
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
