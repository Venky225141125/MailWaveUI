"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { createUpload } from "@/services/userUploadService";
import { ACCEPTED_UPLOAD_EXTENSIONS } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { Button } from "@/components/shared/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export default function NewUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const batch = await createUpload(file);
      router.push(ROUTES.user.upload(batch.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : GENERIC_ERROR);
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
        <Alert message={error} />
        <FileDropzone
          accept={ACCEPTED_UPLOAD_EXTENSIONS}
          file={file}
          onFileChange={(f) => {
            setError(null);
            setFile(f);
          }}
          onReject={setError}
        />
        <Button type="submit" disabled={loading || !file}>
          {loading ? "Uploading…" : "Upload & validate"}
        </Button>
      </form>
    </div>
  );
}
