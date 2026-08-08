"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NativeSelectProps extends React.ComponentProps<"select"> {
  label?: string;
}

/** Native select styled like shadcn inputs (for simple filters/forms). */
export function NativeSelect({
  label,
  id,
  className,
  children,
  ...rest
}: NativeSelectProps) {
  const selectId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label ? <Label htmlFor={selectId}>{label}</Label> : null}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "h-9 w-full min-w-0 appearance-none rounded-xl border border-input bg-card px-3 py-1.5 pr-9 text-sm shadow-sm outline-none transition-all",
            "hover:border-ring/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
            "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            className
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </div>
  );
}

export { NativeSelect as Select };
