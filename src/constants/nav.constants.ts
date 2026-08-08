import type { NavItem } from "@/types/nav.types";
import { ROUTES } from "./routes.constants";

export const SUPER_ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.superAdmin.dashboard, icon: "dashboard" },
  {
    label: "Organizations",
    href: ROUTES.superAdmin.organizations,
    icon: "organizations",
  },
  { label: "Clients", href: ROUTES.superAdmin.clients, icon: "clients" },
];

export const CLIENT_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.client.dashboard, icon: "dashboard" },
  { label: "Users", href: ROUTES.client.users, icon: "users" },
];

export const USER_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.user.dashboard, icon: "dashboard" },
  { label: "Uploads", href: ROUTES.user.uploads, icon: "uploads" },
  { label: "Campaigns", href: ROUTES.user.campaigns, icon: "campaigns" },
];
