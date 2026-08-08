"use client";

import { listCampaigns } from "@/services/userCampaignService";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  useAccountStatus,
  isAccountDisabledError,
} from "@/components/providers/account-status-provider";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/shared/link-button";
import { Alert } from "@/components/shared/alert";
import { CampaignTable } from "@/components/common/CampaignTable";
import { ROUTES } from "@/constants/routes.constants";

export default function UserCampaignsPage() {
  const { isActive, markInactive } = useAccountStatus();
  const { data: campaigns, loading, error } = useAsyncData(async () => {
    try {
      return await listCampaigns();
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      throw err;
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Campaigns"
        description="Send to confirmed-valid addresses and track opens."
        action={
          <LinkButton href={ROUTES.user.newCampaign} disabled={!isActive}>
            + New Campaign
          </LinkButton>
        }
      />
      <Alert message={error} />
      <CampaignTable
        campaigns={campaigns ?? []}
        loading={loading}
        hrefForCampaign={
          isActive ? (c) => ROUTES.user.campaign(c.id) : undefined
        }
      />
    </div>
  );
}
