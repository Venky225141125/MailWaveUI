import { AppShell } from "@/components/Layouts/AppShell";
import { CLIENT_NAV } from "@/constants/nav.constants";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell roleLabel="Client" navItems={CLIENT_NAV} theme="client">
      {children}
    </AppShell>
  );
}
