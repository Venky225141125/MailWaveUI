"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toastApiError, toastError, toastSuccess } from "@/lib/helpers";

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
      toastSuccess("Upload started", "Validation is running on your list.");
      router.push(ROUTES.user.upload(batch.id));
    } catch (err) {
      if (isAccountDisabledError(err)) markInactive();
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="New Upload"
        description={`Accepted formats: ${ACCEPTED_UPLOAD_EXTENSIONS.join(", ")}. We’ll extract every email address and run the five-step validation pipeline.`}
        backHref={ROUTES.user.uploads}
        backLabel="All uploads"
      />
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <fieldset disabled={!isActive} className="flex flex-col gap-4 disabled:opacity-60">
          <FileDropzone
            accept={ACCEPTED_UPLOAD_EXTENSIONS}
            file={file}
            onFileChange={setFile}
            onReject={(message) => toastError(message)}
          />
          <Button type="submit" disabled={loading || !file || !isActive}>
            {loading ? "Uploading…" : "Upload & validate"}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
