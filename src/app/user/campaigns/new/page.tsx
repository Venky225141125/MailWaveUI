"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { listUploads } from "@/services/userUploadService";
import { createCampaign } from "@/services/userCampaignService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export default function NewCampaignPage() {
  const router = useRouter();
  const { data: allBatches, loading: loadingBatches, error: loadError } =
    useAsyncData(() => listUploads(), []);
  const batches = (allBatches ?? []).filter((b) => b.validCount > 0);

  const [name, setName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [subject, setSubject] = useState("");
  const [fromName, setFromName] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
          ? { scheduledAt: new Date(scheduledAt).toISOString() }
          : {}),
      });
      router.push(ROUTES.user.campaign(campaign.id));
    } catch (err) {
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
        <Input
          label="Scheduled At (optional)"
          type="datetime-local"
          hint="Leave blank to send as soon as possible."
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? "Creating…" : "Create Campaign"}
        </Button>
      </form>
    </div>
  );
}
