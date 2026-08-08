"use client";

import { AppShell } from "@/components/Layouts/AppShell";
import {
  AccountStatusProvider,
  InactiveAccountBanner,
} from "@/components/providers/account-status-provider";
import { USER_NAV } from "@/constants/nav.constants";

function UserShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell roleLabel="User" navItems={USER_NAV} theme="user">
      <InactiveAccountBanner />
      {children}
    </AppShell>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountStatusProvider>
      <UserShell>{children}</UserShell>
    </AccountStatusProvider>
  );
}
