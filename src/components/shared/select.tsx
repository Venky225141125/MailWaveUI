"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  triggerClassName?: string;
  /** Accessible name when no visible label */
  "aria-label"?: string;
}

const EMPTY = "__empty__";

/** App select — shadcn dropdown (not native HTML). */
export function FormSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  disabled,
  required,
  className,
  triggerClassName,
  "aria-label": ariaLabel,
}: FormSelectProps) {
  const selectId = label
    ? label.toLowerCase().replace(/\s+/g, "-")
    : undefined;

  const resolvedValue = value === "" ? EMPTY : value;

  return (
    <div className={cn("flex min-w-[11rem] flex-col gap-1.5", className)}>
      {label ? (
        <Label htmlFor={selectId}>
          {label}
          {required ? (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      <ShadcnSelect
        value={resolvedValue}
        onValueChange={(next) =>
          onValueChange(next === EMPTY ? "" : next)
        }
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          id={selectId}
          aria-label={ariaLabel ?? label}
          className={cn(
            "h-9 w-full min-w-[11rem] cursor-pointer rounded-xl border-border bg-card px-3 shadow-sm dark:bg-card",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="rounded-xl border-border/80 p-1.5 shadow-lg"
        >
          {options.map((opt) => {
            const itemValue = opt.value === "" ? EMPTY : opt.value;
            return (
              <SelectItem
                key={itemValue}
                value={itemValue}
                disabled={opt.disabled}
                className="cursor-pointer rounded-lg px-2.5 py-2"
              >
                {opt.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </ShadcnSelect>
    </div>
  );
}

export { FormSelect as Select };
