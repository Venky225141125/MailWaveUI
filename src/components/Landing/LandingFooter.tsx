"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LANDING_NAV_LINKS } from "@/constants/nav.constants";
import { BRAND_NAME } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";

interface LandingFooterProps {
  onOpenLogin: () => void;
  onOpenGetStarted: () => void;
}

export function LandingFooter({
  onOpenLogin,
  onOpenGetStarted,
}: LandingFooterProps) {
  return (
    <footer className="landing-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#52ADFF]/25 bg-[linear-gradient(135deg,rgba(82,173,255,0.14),rgba(32,255,163,0.1))] px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 md:flex-row md:items-center md:px-10">
          <div className="w-full md:max-w-xl">
            <p className="font-heading text-xl font-bold tracking-tight text-[#1A1A1A] sm:text-2xl md:text-3xl">
              Ready to add the next lead?
            </p>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Keep adding. Keep connecting. Keep growing — with lists that are
              validated before they ever leave the platform.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="landing-btn-primary w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="landing-btn-secondary w-full sm:w-auto"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={ROUTES.home} className="inline-flex items-center gap-3">
              <Image
                src="/logo/integratedleads-color-full-logo-black.svg"
                alt={BRAND_NAME}
                width={200}
                height={48}
                className="h-8 w-auto max-w-[180px] object-contain sm:h-9 sm:max-w-none"
              />
            </Link>
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-slate-500 uppercase">
              Product
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {LANDING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-[#4285F4]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-slate-500 uppercase">
              Workspace
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link
                  href={ROUTES.login.superAdmin}
                  className="text-sm text-slate-600 hover:text-[#4285F4]"
                >
                  Super Admin
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.login.client}
                  className="text-sm text-slate-600 hover:text-[#4285F4]"
                >
                  Client login
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.login.user}
                  className="text-sm text-slate-600 hover:text-[#4285F4]"
                >
                  Team User
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-slate-500 uppercase">
              Start
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link
                  href={ROUTES.register.client}
                  className="text-sm text-slate-600 hover:text-[#4285F4]"
                >
                  Register as Client
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.register.freelancer}
                  className="text-sm text-slate-600 hover:text-[#4285F4]"
                >
                  Register as Freelancer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#52ADFF]/15 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-slate-400 uppercase sm:text-[11px] sm:tracking-[0.16em]">
            Keep Adding. Keep Connecting. Keep Growing.
          </p>
        </div>
      </div>
    </footer>
  );
}
