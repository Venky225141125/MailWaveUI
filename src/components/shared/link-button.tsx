import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className,
  disabled,
}: LinkButtonProps) {
  if (disabled) {
    return (
      <Button
        variant={variant === "primary" ? "default" : "outline"}
        disabled
        className={cn(className)}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant={variant === "primary" ? "default" : "outline"}
      className={cn(className)}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
