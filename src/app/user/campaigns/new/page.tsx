"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { CampaignSummary, UploadBatchSummary } from "@/lib/types";
import { FormError } from "@/components/FormError";

export default function NewCampaignPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<UploadBatchSummary[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);

  const [name, setName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [subject, setSubject] = useState("");
  const [fromName, setFromName] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoadingBatches(true);
      try {
        const data = await apiFetch<UploadBatchSummary[]>("/user/uploads");
        setBatches(data.filter((b) => b.validCount > 0));
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load upload batches.");
      } finally {
        setLoadingBatches(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!batchId) {
      setError("Please select a batch with valid emails.");
      return;
    }
    setSubmitting(true);
    try {
      const campaign = await apiFetch<CampaignSummary>("/user/campaigns", {
        method: "POST",
        body: {
          name,
          batchId: Number(batchId),
          subject,
          fromName,
          bodyHtml,
          ...(scheduledAt
            ? { scheduledAt: new Date(scheduledAt).toISOString() }
            : {}),
        },
      });
      router.push(`/user/campaigns/${campaign.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create campaign.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        New Campaign
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <FormError message={error} />

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Campaign Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Upload Batch (only batches with valid emails are listed)
          </label>
          <select
            required
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            disabled={loadingBatches}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">
              {loadingBatches ? "Loading…" : "Select a batch"}
            </option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.originalFilename} — {b.validCount} valid
              </option>
            ))}
          </select>
          {!loadingBatches && batches.length === 0 ? (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              No batches with valid emails yet. Upload a list and wait for
              validation to complete.
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Subject
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            From Name
          </label>
          <input
            type="text"
            required
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Body (HTML)
          </label>
          <textarea
            required
            rows={10}
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Scheduled At (optional — leave blank to send as soon as possible)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {submitting ? "Creating…" : "Create Campaign"}
        </button>
      </form>
    </div>
  );
}
