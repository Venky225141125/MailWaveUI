import { AppShell } from "@/components/Layouts/AppShell";
import { USER_NAV } from "@/constants/nav.constants";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell roleLabel="User" navItems={USER_NAV} theme="user">
      {children}
    </AppShell>
  );
}
