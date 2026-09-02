"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoSymbol } from "@/components/Landing/LogoSymbol";
import { LANDING_NAV_LINKS } from "@/constants/nav.constants";
import { BRAND_NAME, BRAND_TAGLINE } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import Image from "next/image";

interface LandingFooterProps {
  onOpenLogin: () => void;
  onOpenGetStarted: () => void;
}

export function LandingFooter({
  onOpenLogin,
  onOpenGetStarted,
}: LandingFooterProps) {
  return (
    <footer className="landing-footer border-t border-blue-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-8 shadow-sm sm:flex-row sm:items-center sm:px-10">
          <div>
            <p className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Get Started
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={ROUTES.home} className="inline-flex items-center gap-3">
              {/* <LogoSymbol size={32} />
              <span className="font-heading text-lg font-bold text-slate-900">
                {BRAND_NAME}
              </span> */}
              <Image
                src="/logo/integratedleads-color-full-logo-black.svg"
                alt={BRAND_NAME}
                width={100}
                height={100}
                className="w-[250px] h-full object-contain"
              />
            </Link>
            {/* <p className="mt-3 max-w-xs font-mono text-[11px] tracking-widest text-slate-500 uppercase">
              {BRAND_TAGLINE}
            </p> */}
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-slate-600 uppercase">
              Product
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {LANDING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-blue-700"
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
                  className="text-sm text-slate-600 hover:text-blue-700"
                >
                  Super Admin
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.login.client}
                  className="text-sm text-slate-600 hover:text-blue-700"
                >
                  Client login
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.login.user}
                  className="text-sm text-slate-600 hover:text-blue-700"
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
                  className="text-sm text-slate-600 hover:text-blue-700"
                >
                  Register as Client
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.register.freelancer}
                  className="text-sm text-slate-600 hover:text-blue-700"
                >
                  Register as Freelancer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-blue-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] tracking-[0.16em] text-slate-600 uppercase">
            Keep Adding. Keep Connecting. Keep Growing.
          </p>
        </div>
      </div>
    </footer>
  );
}
