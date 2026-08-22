"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { LANDING_SIGN_IN_ROLES } from "@/constants/nav.constants";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

interface SignInRoleModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInRoleModal({ open, onClose }: SignInRoleModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close sign in"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-role-title"
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-[#0B0D16] p-5 shadow-[0_20px_48px_rgb(0_0_0_/_0.55)] outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:outline-none"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <p
          id="signin-role-title"
          className="text-sm font-semibold tracking-tight text-white"
        >
          Sign in
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Choose your workspace role to continue.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          {LANDING_SIGN_IN_ROLES.map((role, index) => (
            <Link
              key={role.href}
              href={role.href}
              className={cn(
                "signin-role-btn group",
                index === 0 && "signin-role-btn--accent"
              )}
            >
              <span>{role.label}</span>
              <ArrowRight className="size-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
            </Link>
          ))}
        </div>

        <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm">
          <p className="text-slate-400">New here?</p>
          <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href={ROUTES.register.client} className="signin-role-link">
              Register as Client
            </Link>
            <Link
              href={ROUTES.register.freelancer}
              className="signin-role-link"
            >
              Register as Freelancer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
