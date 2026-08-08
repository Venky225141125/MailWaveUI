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
import { Alert } from "@/components/shared/alert";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Select } from "@/components/shared/select";
import { Textarea } from "@/components/shared/textarea";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export default function NewCampaignPage() {
  const router = useRouter();
  const { isActive, markInactive } = useAccountStatus();
  const { data: allBatches, loading: loadingBatches, error: loadError } =
    useAsyncData(async () => {
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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
  const [testEmailError, setTestEmailError] = useState<string | null>(null);
  const [sendingTest, setSendingTest] = useState(false);
  const canSendTest = subject.trim() && fromName.trim() && bodyHtml.trim();

  async function handleSendTestEmail() {
    if (!isActive) return;
    setTestEmailError(null);
    setTestEmailStatus(null);
    setSendingTest(true);
    try {
      const result = await sendTestEmail({ subject, fromName, bodyHtml });
      setTestEmailStatus(`Test email sent to ${result.sentTo}`);
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      setTestEmailError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setSendingTest(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isActive) return;
    setError(null);
    if (!batchId) {
      setError("Please select a batch with valid emails.");
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
      setError(err instanceof ApiError ? err.message : GENERIC_ERROR);
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
        <Alert message={error ?? loadError} />
        {!isActive ? (
          <Alert
            tone="error"
            message="Your account is inactive. Campaign actions are disabled until a Client admin reactivates you."
          />
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
          />
          <Select
            label="Upload Batch"
            required
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            disabled={loadingBatches}
          >
            <option value="">
              {loadingBatches ? "Loading…" : "Select a batch"}
            </option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.originalFilename} — {b.validCount} valid
              </option>
            ))}
          </Select>
          {!loadingBatches && batches.length === 0 ? (
            <Alert
              tone="info"
              message="No batches with valid emails yet. Upload a list and wait for validation to finish."
            />
          ) : null}
          <Input
            label="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Input
            label="From Name"
            required
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
          />
          <Textarea
            label="Body (HTML)"
            required
            rows={10}
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
          />
          <Alert tone="success" message={testEmailStatus} />
          <Alert message={testEmailError} />
          <Button
            type="button"
            variant="secondary"
            disabled={!canSendTest || sendingTest || !isActive}
            onClick={handleSendTestEmail}
          >
            {sendingTest ? "Sending…" : "Send Test Email to Myself"}
          </Button>
          <div className="flex gap-3">
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
              onChange={(e) => setTimezone(e.target.value)}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </Select>
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
