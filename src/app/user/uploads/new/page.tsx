"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { createUpload } from "@/services/userUploadService";
import { ACCEPTED_UPLOAD_EXTENSIONS } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import {
  useAccountStatus,
  isAccountDisabledError,
} from "@/components/providers/account-status-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/shared/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { toastError } from "@/lib/helpers/toast.utils";

export default function NewUploadPage() {
  const router = useRouter();
  const { isActive, markInactive } = useAccountStatus();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isActive) return;
    if (!file) {
      toastError("Please choose a file to upload.");
      return;
    }
    setLoading(true);
    try {
      const batch = await createUpload(file);
      router.push(ROUTES.user.upload(batch.id));
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      toastError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="New Upload"
        description={`Accepted formats: ${ACCEPTED_UPLOAD_EXTENSIONS.join(", ")}. We'll extract every email address and run the five-step validation pipeline.`}
        backHref={ROUTES.user.uploads}
        backLabel="All uploads"
      />
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {!isActive ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            Your account is inactive. Uploads are disabled until a Client admin
            reactivates you.
          </div>
        ) : null}
        <fieldset disabled={!isActive} className="flex flex-col gap-4 disabled:opacity-60">
          <FileDropzone
            accept={ACCEPTED_UPLOAD_EXTENSIONS}
            file={file}
            onFileChange={setFile}
            onReject={toastError}
          />
          <Button type="submit" disabled={loading || !file || !isActive}>
            {loading ? "Uploading…" : "Upload & validate"}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
