"use client";

import { Button } from "@/components/ui/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page <= 0}
      >
        Previous
      </Button>
      <span className="text-sm text-[var(--text-muted)]">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Next
      </Button>
    </div>
  );
}
