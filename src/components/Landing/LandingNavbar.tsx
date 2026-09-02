"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { LANDING_NAV_LINKS } from "@/constants/nav.constants";
import { BRAND_NAME } from "@/constants/upload.constants";
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
        scrolled ? "landing-nav--solid" : "landing-nav--ghost"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.home}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label={BRAND_NAME}
          >
            <Image
              src="/logo/integratedleads-color-full-logo-black.svg"
              alt={BRAND_NAME}
              width={200}
              height={48}
              className="h-9 w-auto object-contain sm:h-10"
              priority
            />
          </Link>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Landing"
          >
            {LANDING_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="landing-nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[#4285F4]"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="landing-btn-primary !px-4 !py-2 !text-xs"
            >
              <span>Get Started</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="landing-btn-primary !px-3 !py-1.5 !text-xs sm:hidden"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-slate-700 hover:bg-[#52ADFF]/10 hover:text-[#4285F4] focus:outline-none"
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
          className="border-b border-[#52ADFF]/20 bg-white/95 px-4 pt-3 pb-6 shadow-xl backdrop-blur-2xl lg:hidden"
        >
          <div className="flex flex-col space-y-1 py-2">
            {LANDING_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-[#52ADFF]/10 hover:text-[#4285F4]"
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
              className="w-full rounded-lg bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGetStarted();
              }}
              className="landing-btn-primary w-full"
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
