import { AppShell } from "@/components/Layouts/AppShell";
import { SUPER_ADMIN_NAV } from "@/constants/nav.constants";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell roleLabel="Super Admin" navItems={SUPER_ADMIN_NAV}>
      {children}
    </AppShell>
  );
}
