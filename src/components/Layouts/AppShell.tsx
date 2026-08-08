"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
import { getUsername, logout } from "@/lib/auth";
import { BRAND_NAME } from "@/constants/upload.constants";
import { useTheme } from "@/components/providers/theme-provider";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconMenu,
  NavIcon,
} from "@/components/shared/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavItem } from "@/types/nav.types";

export type { NavItem };

const SIDEBAR_KEY = "mw_sidebar_collapsed";

interface AppShellProps {
  roleLabel: string;
  navItems: NavItem[];
  children: React.ReactNode;
  /** Role color theme from the design system */
  theme?: "super-admin" | "client" | "user";
}

export function AppShell({
  roleLabel,
  navItems,
  children,
  theme = "super-admin",
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme: colorMode, toggleTheme } = useTheme();
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

  const displayName = username ?? "Account";
  const initials =
    displayName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U";

  return (
    <div className={`app-shell theme-${theme}`}>
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
            <div className="app-shell__brand-name">{BRAND_NAME}</div>
            <div className="app-shell__brand-role">{roleLabel}</div>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--sidebar-muted)] hover:text-[var(--sidebar-foreground)] sm:hidden"
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
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex max-w-[13rem] cursor-pointer items-center gap-2 rounded-full border border-border bg-card py-1 pr-2.5 pl-1 text-left shadow-sm transition-colors hover:bg-muted/70"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {username ? initials : <UserRound className="size-4" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {displayName}
                </span>
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52 p-1.5">
              <DropdownMenuLabel className="px-2.5 py-2 font-normal">
                <div className="truncate text-sm font-semibold">{displayName}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  toggleTheme();
                }}
                className="cursor-pointer gap-2 rounded-lg px-2.5 py-2"
              >
                {colorMode === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
                {colorMode === "dark" ? "Light mode" : "Dark mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                variant="destructive"
                onSelect={handleLogout}
                className="cursor-pointer gap-2 rounded-lg px-2.5 py-2"
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
