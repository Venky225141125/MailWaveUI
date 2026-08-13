"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { TIMEZONE_OPTIONS, zonedDateTimeToUtcIso } from "@/lib/timezone";
import { listUploads } from "@/services/userUploadService";
import { createCampaign, sendTestEmail } from "@/services/userCampaignService";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  useAccountStatus,
  isAccountDisabledError,
} from "@/components/providers/account-status-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Select } from "@/components/shared/select";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { FORM_PLACEHOLDERS } from "@/constants/form-placeholders.constants";
import { toastError, toastSuccess } from "@/lib/helpers/toast.utils";

export default function NewCampaignPage() {
  const router = useRouter();
  const { isActive, markInactive } = useAccountStatus();
  const { data: allBatches, loading: loadingBatches } = useAsyncData(async () => {
    try {
      return await listUploads();
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      throw err;
    }
  }, []);
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
  const canSendTest = subject.trim() && fromName.trim() && bodyHtml.trim();

  async function handleSendTestEmail() {
    if (!isActive) return;
    setSendingTest(true);
    try {
      const result = await sendTestEmail({ subject, fromName, bodyHtml });
      toastSuccess(`Test email sent to ${result.sentTo}`);
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      toastError(err instanceof ApiError ? err.message : GENERIC_ERROR);
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
      router.push(ROUTES.user.campaign(campaign.id));
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      toastError(err instanceof ApiError ? err.message : GENERIC_ERROR);
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
        {!isActive ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            Your account is inactive. Campaign actions are disabled until a
            Client admin reactivates you.
          </div>
        ) : null}
        <fieldset
          disabled={!isActive}
          className="flex flex-col gap-4 disabled:opacity-60"
        >
          <Input
            label="Campaign Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={FORM_PLACEHOLDERS.user.campaignName}
          />
          <Select
            label="Upload Batch"
            required
            value={batchId}
            onValueChange={setBatchId}
            disabled={loadingBatches || !isActive}
            placeholder={loadingBatches ? "Loading…" : "Select a batch"}
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
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={FORM_PLACEHOLDERS.user.subject}
          />
          <Input
            label="From Name"
            required
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            placeholder={FORM_PLACEHOLDERS.user.fromName}
          />
          <RichTextEditor
            label="Body (HTML)"
            required
            value={bodyHtml}
            onChange={setBodyHtml}
            disabled={!isActive}
            placeholder="Write the campaign message your recipients will see…"
          />
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
