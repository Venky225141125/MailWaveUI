"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { LogoSymbol } from "@/components/Landing/LogoSymbol";
import { LANDING_NAV_LINKS } from "@/constants/nav.constants";
import { BRAND_NAME, BRAND_TAGLINE } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

const SCROLL_OFFSET = 80;

interface LandingNavbarProps {
  onOpenLogin: () => void;
  onOpenGetStarted: () => void;
}

export function LandingNavbar({
  onOpenLogin,
  onOpenGetStarted,
}: LandingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  function handleScrollTo(e: MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }

  return (
    <header
      id="main-navigation"
      className={cn(
        "landing-nav",
        scrolled ? "landing-nav--solid" : "landing-nav--ghost",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.home}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label={BRAND_NAME}
          >
            {/* <LogoSymbol size={34} animated /> */}
            <Image
              src="/logo/integratedleads-color-full-logo-black.svg"
              alt={BRAND_NAME}
              width={100}
              height={100}
              className="w-[250px] h-full object-contain"
            />
            {/* <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-700 sm:text-xl">
                {BRAND_NAME}
              </span>
              <span className="-mt-1 font-mono text-[10px] font-medium tracking-widest text-slate-400 uppercase">
                {BRAND_TAGLINE}
              </span>
            </div> */}
          </Link>

          <nav
            className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-md lg:flex"
            aria-label="Landing"
          >
            {LANDING_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:text-blue-700"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="group relative flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.22)] transition-all hover:bg-blue-700"
            >
              <span>Get Started</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:hidden"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div
          id="mobile-drawer-menu"
          className="border-b border-slate-200 bg-white/95 px-4 pt-3 pb-6 shadow-xl backdrop-blur-2xl lg:hidden"
        >
          <div className="flex flex-col space-y-2 py-2">
            {LANDING_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <span>{link.label}</span>
                <ArrowRight className="size-3.5 text-slate-400" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full rounded-lg bg-slate-50 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGetStarted();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white"
            >
              <span>Get Started Free</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
