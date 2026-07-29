"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { UploadBatchSummary } from "@/lib/types";
import { FormError } from "@/components/FormError";

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls", ".doc", ".docx", ".pdf"];

export default function NewUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function isAcceptedFile(f: File): boolean {
    const lower = f.name.toLowerCase();
    return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
  }

  function handleFiles(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    if (!isAcceptedFile(f)) {
      setError(
        `Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`
      );
      return;
    }
    setError(null);
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const batch = await apiFetch<UploadBatchSummary>("/user/uploads", {
        method: "POST",
        body: fd,
      });
      router.push(`/user/uploads/${batch.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        New Upload
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Accepted formats: {ACCEPTED_EXTENSIONS.join(", ")}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <FormError message={error} />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragActive
              ? "border-sky-500 bg-sky-50 dark:bg-sky-950/30"
              : "border-zinc-300 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          }`}
        >
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {file ? file.name : "Drag & drop a file here, or click to browse"}
          </p>
          {file ? (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {loading ? "Uploading…" : "Upload"}
        </button>
      </form>
    </div>
  );
}
