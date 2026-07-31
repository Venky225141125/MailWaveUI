export type NavIconName =
  | "dashboard"
  | "organizations"
  | "clients"
  | "users"
  | "uploads"
  | "campaigns";

export interface NavItem {
  label: string;
  href: string;
  icon: NavIconName;
}
