"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
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
  type,
  ...rest
}: FormInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const compact = density === "compact";
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className={cn("flex flex-col", compact ? "gap-0.5" : "gap-1.5")}>
      {label ? (
        <Label htmlFor={inputId} className={cn(compact && "text-xs")}>
          {label}
          {rest.required ? (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      <div className="relative">
        <ShadcnInput
          id={inputId}
          type={resolvedType}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            compact && "h-7 text-xs",
            isPassword && "pr-9",
            className
          )}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        ) : null}
      </div>
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
