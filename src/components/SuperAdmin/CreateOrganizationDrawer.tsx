"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import { createOrganization } from "@/services/superAdminService";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { FORM_PLACEHOLDERS } from "@/constants/form-placeholders.constants";
import { toastError, toastSuccess } from "@/lib/helpers/toast.utils";

interface CreateOrganizationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function CreateOrganizationDrawer({
  open,
  onOpenChange,
  onCreated,
}: CreateOrganizationDrawerProps) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setName("");
    setWebsite("");
    setLoading(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrganization({ name, website });
      toastSuccess("Organization added to the whitelist.");
      onCreated();
      handleOpenChange(false);
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-l border-border/80 p-0 sm:max-w-md"
      >
        <div className="relative overflow-hidden border-b border-border/80 bg-gradient-to-br from-primary/12 via-card to-sky-500/8 px-6 pb-5 pt-6">
          <SheetHeader className="relative space-y-1 p-0">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Building2 className="size-5" />
            </div>
            <SheetTitle className="text-lg font-semibold tracking-tight">
              Add organization
            </SheetTitle>
            <SheetDescription className="text-sm leading-relaxed">
              Whitelist a company so client sign-up can match name and website
              exactly.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 px-6 py-6"
        >
          <Input
            label="Organization name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={FORM_PLACEHOLDERS.superAdmin.organizationName}
          />
          <Input
            label="Website"
            required
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder={FORM_PLACEHOLDERS.superAdmin.organizationDomain}
          />
          <SheetFooter className="mt-auto gap-2 p-0 pt-2 sm:flex-col">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding…" : "Add organization"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
