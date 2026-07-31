"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsername, logout } from "@/lib/auth";
import { BRAND_NAME } from "@/constants/upload.constants";
import { Button } from "@/components/ui/Button";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconMenu,
  NavIcon,
} from "@/components/ui/Icons";
import type { NavItem } from "@/types/nav.types";

export type { NavItem };

const SIDEBAR_KEY = "mw_sidebar_collapsed";

interface AppShellProps {
  roleLabel: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export function AppShell({ roleLabel, navItems, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Cookies only readable client-side; post-mount avoids hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsername(getUsername());
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="app-shell">
      <div
        className={`app-shell__overlay${mobileOpen ? " is-open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`app-shell__sidebar${collapsed ? " is-collapsed" : ""}${
          mobileOpen ? " is-mobile-open" : ""
        }`}
        aria-label="Application sidebar"
      >
        <div className="app-shell__brand">
          <div className="app-shell__brand-mark" aria-hidden>
            MW
          </div>
          <div className="app-shell__brand-text">
            <div className="truncate text-sm font-semibold tracking-tight text-[var(--text)]">
              {BRAND_NAME}
            </div>
            <div className="truncate text-xs text-[var(--text-muted)]">
              {roleLabel}
            </div>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] sm:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <IconClose />
          </button>
        </div>

        <nav className="app-shell__nav" aria-label="Primary">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`app-shell__nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="app-shell__nav-icon">
                  <NavIcon name={item.icon} />
                </span>
                <span className="app-shell__nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-shell__sidebar-footer">
          <button
            type="button"
            className="app-shell__collapse-btn"
            onClick={toggleCollapsed}
            aria-pressed={collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
            {!collapsed ? <span>Collapse</span> : null}
          </button>
        </div>
      </aside>

      <div className="app-shell__main">
        <header className="app-shell__header">
          <div className="app-shell__header-left">
            <button
              type="button"
              className="app-shell__menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <IconMenu />
            </button>
            <div className="truncate text-sm text-[var(--text-muted)]">
              Signed in as{" "}
              <span className="font-medium text-[var(--text)]">
                {username ?? "…"}
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </header>
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
