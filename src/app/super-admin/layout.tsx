import { AppShell } from "@/components/AppShell";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/super-admin/dashboard" },
  { label: "Organizations", href: "/super-admin/organizations" },
  { label: "Clients", href: "/super-admin/clients" },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell roleLabel="Super Admin" navItems={NAV_ITEMS}>
      {children}
    </AppShell>
  );
}
