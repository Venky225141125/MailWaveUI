"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIMEZONE_OPTIONS, zonedDateTimeToUtcIso } from "@/lib/timezone";
import { listUploads } from "@/services/userUploadService";
import { createCampaign, sendTestEmail } from "@/services/userCampaignService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useToastOnError } from "@/hooks/useToastOnError";
import {
  useAccountStatus,
  isAccountDisabledError,
} from "@/components/providers/account-status-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Select } from "@/components/shared/select";
import { ROUTES } from "@/constants/routes.constants";
import { toastApiError, toastError, toastSuccess } from "@/lib/helpers";

const RichTextEditor = dynamic(
  () =>
    import("@/components/shared/rich-text-editor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] animate-pulse rounded-xl border border-border/80 bg-muted/40" />
    ),
  }
);

function hasRichTextContent(value: string) {
  return (
    value
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, "")
      .replace(/\u00A0/g, "")
      .trim().length > 0
  );
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { isActive, markInactive } = useAccountStatus();
  const {
    data: allBatches,
    loading: loadingBatches,
    error: loadError,
  } = useAsyncData(async () => {
    try {
      return await listUploads();
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      throw err;
    }
  }, []);
  useToastOnError(loadError);
  const batches = (allBatches ?? []).filter((b) => b.validCount > 0);

  const [name, setName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [subject, setSubject] = useState("");
  const [fromName, setFromName] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [timezone, setTimezone] = useState(
    TIMEZONE_OPTIONS[TIMEZONE_OPTIONS.length - 1].value
  );
  const [submitting, setSubmitting] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const canSendTest =
    subject.trim() && fromName.trim() && hasRichTextContent(bodyHtml);

  async function handleSendTestEmail() {
    if (!isActive) return;
    setSendingTest(true);
    try {
      const result = await sendTestEmail({ subject, fromName, bodyHtml });
      toastSuccess("Test email sent", `Delivered to ${result.sentTo}`);
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      toastApiError(err);
    } finally {
      setSendingTest(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isActive) return;
    if (!batchId) {
      toastError("Please select a batch with valid emails.");
      return;
    }
    if (!hasRichTextContent(bodyHtml)) {
      toastError("Add an email body before creating the campaign.");
      return;
    }
    setSubmitting(true);
    try {
      const campaign = await createCampaign({
        name,
        batchId: Number(batchId),
        subject,
        fromName,
        bodyHtml,
        ...(scheduledAt
          ? { scheduledAt: zonedDateTimeToUtcIso(scheduledAt, timezone) }
          : {}),
      });
      toastSuccess("Campaign created", campaign.name);
      router.push(ROUTES.user.campaign(campaign.id));
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      toastApiError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="New Campaign"
        description="Only lists with at least one confirmed-valid address can be used."
        backHref={ROUTES.user.campaigns}
        backLabel="All campaigns"
      />
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <fieldset
          disabled={!isActive}
          className="flex flex-col gap-4 disabled:opacity-60"
        >
          <Input
            label="Campaign Name"
            required
            placeholder="Spring product launch"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label="Upload Batch"
            required
            value={batchId}
            onValueChange={setBatchId}
            disabled={loadingBatches || !isActive}
            placeholder={loadingBatches ? "Loading…" : "Select a validated list"}
            options={[
              ...batches.map((b) => ({
                value: String(b.id),
                label: `${b.originalFilename} — ${b.validCount} valid`,
              })),
            ]}
          />
          {!loadingBatches && batches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No batches with valid emails yet. Upload a list and wait for
              validation to finish.
            </p>
          ) : null}
          <Input
            label="Subject"
            required
            placeholder="You’re invited — exclusive early access"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Input
            label="From Name"
            required
            placeholder="Acme Marketing"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Body
              <span className="ml-0.5 text-destructive" aria-hidden>
                *
              </span>
            </label>
            <RichTextEditor
              value={bodyHtml}
              onChange={setBodyHtml}
              placeholder="Write the email your recipients will actually want to open…"
              disabled={!isActive}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={!canSendTest || sendingTest || !isActive}
            onClick={handleSendTestEmail}
          >
            {sendingTest ? "Sending…" : "Send Test Email to Myself"}
          </Button>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              label="Scheduled At (optional)"
              type="datetime-local"
              hint="Leave blank to send as soon as possible. Interpreted in the timezone selected below."
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="flex-1"
            />
            <Select
              label="Timezone"
              value={timezone}
              onValueChange={setTimezone}
              className="sm:w-56"
              placeholder="Select timezone"
              options={TIMEZONE_OPTIONS.map((tz) => ({
                value: tz.value,
                label: tz.label,
              }))}
            />
          </div>
          <Button
            type="submit"
            disabled={submitting || !isActive}
            className="mt-2"
          >
            {submitting ? "Creating…" : "Create Campaign"}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
