"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsername, logout } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
}

interface AppShellProps {
  roleLabel: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export function AppShell({ roleLabel, navItems, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Cookies are only readable client-side; reading them post-mount (rather
    // than as a lazy useState initializer) avoids an SSR/hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsername(getUsername());
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 sm:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-zinc-200 bg-white sm:w-56 sm:border-b-0 sm:border-r dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Email Broadcaster
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {roleLabel}
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Signed in as{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {username ?? "…"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
