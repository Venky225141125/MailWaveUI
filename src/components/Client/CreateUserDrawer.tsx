"use client";

import { useState } from "react";
import { Check, Copy, UserPlus } from "lucide-react";
import { ApiError } from "@/lib/api";
import { createUser } from "@/services/clientService";
import type { CreateUserResponse } from "@/types";
import { Alert } from "@/components/shared/alert";
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

interface CreateUserDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (user: CreateUserResponse) => void;
}

export function CreateUserDrawer({
  open,
  onOpenChange,
  onCreated,
}: CreateUserDrawerProps) {
  const [username, setUsername] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<CreateUserResponse | null>(null);
  const [copied, setCopied] = useState(false);

  function resetForm() {
    setUsername("");
    setOfficialEmail("");
    setError(null);
    setLoading(false);
    setCreated(null);
    setCopied(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await createUser({ username, officialEmail });
      setCreated(result);
      onCreated(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  }

  async function copyPassword() {
    if (!created?.tempPassword) return;
    try {
      await navigator.clipboard.writeText(created.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-l border-border/80 p-0 sm:max-w-md"
      >
        <div className="relative overflow-hidden border-b border-border/80 bg-gradient-to-br from-primary/12 via-card to-sky-500/8 px-6 pb-5 pt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-primary/15 blur-2xl"
          />
          <SheetHeader className="relative space-y-1 p-0">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <UserPlus className="size-5" />
            </div>
            <SheetTitle className="text-lg font-semibold tracking-tight">
              {created ? "User created" : "Add team user"}
            </SheetTitle>
            <SheetDescription className="text-sm leading-relaxed">
              {created
                ? "Share the temporary password now — it won’t be shown again."
                : "Invite someone who can upload lists and run campaigns."}
            </SheetDescription>
          </SheetHeader>
        </div>

        {created ? (
          <div className="flex flex-1 flex-col gap-5 px-6 py-6">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 dark:border-amber-900 dark:bg-amber-950/40">
              <p className="text-sm text-amber-900 dark:text-amber-200">
                Temporary password for{" "}
                <span className="font-semibold">{created.username}</span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className="flex-1 rounded-lg border border-amber-200 bg-card px-3 py-2.5 font-mono text-base font-semibold tracking-wide text-foreground dark:border-amber-900">
                  {created.tempPassword ?? "(not returned)"}
                </code>
                {created.tempPassword ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={copyPassword}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                ) : null}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                They’ll be asked to reset this password on first login.
              </p>
            </div>
            <SheetFooter className="p-0">
              <Button
                type="button"
                className="w-full"
                onClick={() => handleOpenChange(false)}
              >
                Done
              </Button>
            </SheetFooter>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-4 px-6 py-6"
          >
            <Alert message={error} />
            <Input
              label="Username"
              required
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jane.doe"
            />
            <Input
              label="Official email"
              type="email"
              required
              autoComplete="off"
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              placeholder="jane@company.com"
            />
            <SheetFooter className="mt-auto gap-2 p-0 pt-2 sm:flex-col">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating…" : "Create user"}
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
        )}
      </SheetContent>
    </Sheet>
  );
}
