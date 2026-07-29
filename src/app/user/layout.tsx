import { AppShell } from "@/components/AppShell";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/user/dashboard" },
  { label: "Uploads", href: "/user/uploads" },
  { label: "Campaigns", href: "/user/campaigns" },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell roleLabel="User" navItems={NAV_ITEMS}>
      {children}
    </AppShell>
  );
}
