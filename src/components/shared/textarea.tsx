import * as React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
}

export function FormTextarea({
  label,
  id,
  className,
  ...rest
}: FormTextareaProps) {
  const areaId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label ? <Label htmlFor={areaId}>{label}</Label> : null}
      <ShadcnTextarea
        id={areaId}
        className={cn("font-mono", className)}
        {...rest}
      />
    </div>
  );
}

export { FormTextarea as Textarea };
