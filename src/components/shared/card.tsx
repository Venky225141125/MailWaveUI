import type { ReactNode } from "react";
import { Card as ShadcnCard, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <ShadcnCard className={cn(className)}>
      {padding ? <CardContent>{children}</CardContent> : children}
    </ShadcnCard>
  );
}
