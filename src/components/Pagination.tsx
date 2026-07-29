interface PaginationProps {
  page: number; // 0-indexed
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 0}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
      >
        Previous
      </button>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
      >
        Next
      </button>
    </div>
  );
}
