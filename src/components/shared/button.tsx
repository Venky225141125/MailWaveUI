"use client";

import * as React from "react";
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppVariant = "primary" | "secondary" | "ghost" | "danger";
type AppSize = "sm" | "md";

const VARIANT_MAP: Record<
  AppVariant,
  React.ComponentProps<typeof ShadcnButton>["variant"]
> = {
  primary: "default",
  secondary: "outline",
  ghost: "ghost",
  danger: "destructive",
};

const SIZE_MAP: Record<
  AppSize,
  React.ComponentProps<typeof ShadcnButton>["size"]
> = {
  sm: "sm",
  md: "lg",
};

interface ButtonProps extends Omit<
  React.ComponentProps<typeof ShadcnButton>,
  "variant" | "size"
> {
  variant?: AppVariant;
  size?: AppSize;
}

/** App Button — shadcn underneath, MailWave variant names. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={VARIANT_MAP[variant]}
      size={SIZE_MAP[size]}
      className={cn(className)}
      {...props}
    />
  );
}

export { buttonVariants };
