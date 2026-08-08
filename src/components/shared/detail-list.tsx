import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function DetailList({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Card size="sm" className="shadow-none">
      <CardContent className="px-4 py-3">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-1 text-sm">{children}</dd>
      </CardContent>
    </Card>
  );
}
