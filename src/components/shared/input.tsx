import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string;
  hint?: string;
  error?: string | null;
  density?: "compact" | "default";
}

/** Labeled input with validation message — built on shadcn Input/Label. */
export function FormInput({
  label,
  hint,
  error,
  density = "default",
  id,
  className,
  ...rest
}: FormInputProps) {
  const inputId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const compact = density === "compact";

  return (
    <div className={cn("flex flex-col", compact ? "gap-0.5" : "gap-1.5")}>
      {label ? (
        <Label
          htmlFor={inputId}
          className={cn(compact && "text-xs")}
        >
          {label}
          {rest.required ? (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      <ShadcnInput
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(compact && "h-7 text-xs", className)}
        {...rest}
      />
      {error ? (
        <p
          id={errorId}
          role="alert"
          className={cn(
            "font-medium text-destructive",
            compact ? "text-[11px] leading-tight" : "text-xs"
          )}
        >
          {error}
        </p>
      ) : hint ? (
        <p
          className={cn(
            "text-muted-foreground",
            compact ? "text-[11px] leading-tight" : "text-xs"
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export { FormInput as Input };
