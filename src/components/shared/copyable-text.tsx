"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyableTextProps {
  value: string;
  className?: string;
  /** Extra classes for the text span */
  textClassName?: string;
}

export function CopyableText({
  value,
  className,
  textClassName,
}: CopyableTextProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <span
      className={cn(
        "group/copy inline-flex max-w-full items-center gap-1.5",
        className
      )}
    >
      <span className={cn("truncate", textClassName)}>{value}</span>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          "opacity-70 group-hover/copy:opacity-100 focus-visible:opacity-100",
          copied && "text-emerald-600 opacity-100"
        )}
        aria-label={copied ? "Copied" : `Copy ${value}`}
        title={copied ? "Copied" : "Copy"}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </span>
  );
}
