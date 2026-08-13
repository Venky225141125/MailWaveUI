"use client";

import { useParams } from "next/navigation";
import {
  listUserCampaigns,
  listUserUploads,
} from "@/services/clientService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { UploadBatchTable } from "@/components/common/UploadBatchTable";
import { CampaignTable } from "@/components/common/CampaignTable";
import { ROUTES } from "@/constants/routes.constants";

export default function ClientUserProgressPage() {
  const params = useParams<{ userId: string }>();
  const { data, loading } = useAsyncData(async () => {
    const [uploads, campaigns] = await Promise.all([
      listUserUploads(params.userId),
      listUserCampaigns(params.userId),
    ]);
    return { uploads, campaigns };
  }, [params.userId]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="User Progress"
        description="Read-only uploads and campaigns for this team member."
        backHref={ROUTES.client.users}
        backLabel="All users"
      />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Uploads
        </h2>
        <UploadBatchTable
          batches={data?.uploads ?? []}
          loading={loading}
          emptyMessage="No uploads yet."
        />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Campaigns
        </h2>
        <CampaignTable
          campaigns={data?.campaigns ?? []}
          loading={loading}
          emptyMessage="No campaigns yet."
        />
      </section>
    </div>
  );
}
