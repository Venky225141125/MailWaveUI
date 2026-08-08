"use client";

import { useId, useRef, useState } from "react";
import { formatFileSize } from "@/lib/helpers";
import { isAcceptedUploadFile } from "@/lib/helpers";

interface FileDropzoneProps {
  accept: readonly string[];
  file: File | null;
  onFileChange: (file: File | null) => void;
  onReject?: (message: string) => void;
}

export function FileDropzone({
  accept,
  file,
  onFileChange,
  onReject,
}: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function handleFiles(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    if (!isAcceptedUploadFile(f.name, accept)) {
      onReject?.(
        `Unsupported file type. Accepted: ${accept.join(", ")}`
      );
      return;
    }
    onFileChange(f);
  }

  return (
    <div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
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
        className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed px-6 py-12 text-center transition-colors ${
          dragActive
            ? "border-[var(--brand)] bg-[var(--brand-muted)]"
            : "border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
        }`}
      >
        <p className="text-sm font-medium text-[var(--text)]">
          {file ? file.name : "Drag & drop a file here, or click to browse"}
        </p>
        {file ? (
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {formatFileSize(file.size)}
          </p>
        ) : (
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {accept.join(" · ")}
          </p>
        )}
      </button>
    </div>
  );
}
