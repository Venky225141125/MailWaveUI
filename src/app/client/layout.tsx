import { AppShell } from "@/components/AppShell";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/client/dashboard" },
  { label: "Users", href: "/client/users" },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell roleLabel="Client" navItems={NAV_ITEMS}>
      {children}
    </AppShell>
  );
}
