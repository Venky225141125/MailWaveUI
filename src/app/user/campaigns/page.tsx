"use client";

import { listCampaigns } from "@/services/userCampaignService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/shared/link-button";
import { Alert } from "@/components/shared/alert";
import { CampaignTable } from "@/components/common/CampaignTable";
import { ROUTES } from "@/constants/routes.constants";

export default function UserCampaignsPage() {
  const { data: campaigns, loading, error } = useAsyncData(
    () => listCampaigns(),
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Campaigns"
        description="Send to confirmed-valid addresses and track opens."
        action={
          <LinkButton href={ROUTES.user.newCampaign}>+ New Campaign</LinkButton>
        }
      />
      <Alert message={error} />
      <CampaignTable
        campaigns={campaigns ?? []}
        loading={loading}
        hrefForCampaign={(c) => ROUTES.user.campaign(c.id)}
      />
    </div>
  );
}
