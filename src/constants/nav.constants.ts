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

export const LANDING_NAV_LINKS = [
  { label: "Philosophy", href: "#brand-story" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Interactive Carousel", href: "#carousel" },
  // { label: "Network Lab", href: "#network-playground" },
] as const;

export const LANDING_SIGN_IN_ROLES = [
  { label: "Super Admin", href: ROUTES.login.superAdmin, variant: "primary" as const },
  { label: "Client", href: ROUTES.login.client, variant: "secondary" as const },
  { label: "Team User", href: ROUTES.login.user, variant: "secondary" as const },
] as const;

export const PHILOSOPHY_SLIDES = [
  {
    id: "adding",
    kicker: "01 — Add",
    title: "Keep Adding",
    statement: "A network begins with one more point.",
    body: "Integrate Leads is built on accumulation. Every name, every inbox, every record is a new node of potential. Adding is not clutter — it is how a database becomes possible. One lead, then another, until there is something worth joining.",
    image: "/landing/philosophy-adding.png",
    mark: "add" as const,
  },
  {
    id: "connecting",
    kicker: "02 — Connect",
    title: "Keep Connecting",
    statement: "Integration is the act of joining what was separate.",
    body: "A lead on its own is only a point. Connection is the line between people, lists, campaigns, and outcomes. This is the meaning of Integrate: bringing things together until isolated records become a living network.",
    image: "/landing/philosophy-connecting.png",
    mark: "connect" as const,
  },
  {
    id: "growing",
    kicker: "03 — Grow",
    title: "Keep Growing",
    statement: "Growth is what adding and connecting become over time.",
    body: "The brand mark should feel larger than a letter because the work is larger than a name. Keep growing is the loop: add, join, expand — then add again. A symbol that can stand alone because the story is already inside it.",
    image: "/landing/philosophy-growing.png",
    mark: "grow" as const,
  },
] as const;

export const HOW_IT_WORKS_STAGES = [
  {
    name: "LEADS",
    tag: "01 Ingest",
    desc: "Raw contact streams",
    detail:
      "Bring in lists from CSV, XLSX, or API. Every record starts as a point of potential — the first act of adding.",
  },
  {
    name: "UPLOAD",
    tag: "02 Parse",
    desc: "CSV & API normalization",
    detail:
      "Columns, encodings, and duplicates are normalized into one shape so later stages never guess at the data.",
  },
  {
    name: "VALIDATE",
    tag: "03 Verify",
    desc: "MX, DNS & SMTP filters",
    detail:
      "Addresses are checked before a send. Invalid and bounce-prone inboxes drop out so the network stays clean.",
  },
  {
    name: "SEGMENT",
    tag: "04 Cluster",
    desc: "Behavioral lead groups",
    detail:
      "Verified leads are clustered into groups you can actually use — the first connections inside the database.",
  },
  {
    name: "CAMPAIGN",
    tag: "05 Compose",
    desc: "Dynamic templates",
    detail:
      "Write once, send to confirmed-good segments. Templates carry the message; the list carries the reach.",
  },
  {
    name: "CONNECT",
    tag: "06 Broadcast",
    desc: "Warm IP inbox delivery",
    detail:
      "The join happens here: a campaign meets a validated inbox. This is Integrate — bringing things together.",
  },
  {
    name: "GROW",
    tag: "07 Scale",
    desc: "Compound network ROI",
    detail:
      "Opens, delivery, and the next upload compound. Keep adding, keep connecting, keep growing.",
  },
] as const;

export const LANDING_FEATURES = [
  {
    id: "ingest",
    title: "Ingest any list",
    body: "Upload CSV, XLSX, or documents. Raw streams land in one shape so adding never depends on a perfect file.",
    tag: "Add",
    icon: "upload" as const,
  },
  {
    id: "validate",
    title: "Validate before you send",
    body: "MX, DNS, and SMTP checks drop invalid and bounce-prone inboxes. Campaigns only meet confirmed-good addresses.",
    tag: "Connect",
    icon: "shield" as const,
  },
  {
    id: "dedup",
    title: "Deduplicate the network",
    body: "The same lead should not live twice. Matching collapses copies so the database grows in quality, not noise.",
    tag: "Add",
    icon: "layers" as const,
  },
  {
    id: "campaigns",
    title: "Compose on clean segments",
    body: "Write once, send to verified groups. Templates carry the message; the list carries the reach.",
    tag: "Connect",
    icon: "mail" as const,
  },
  {
    id: "metrics",
    title: "Measure every join",
    body: "Sent, opened, bounced — delivery is visible. Growth is a number you can read, not a slogan.",
    tag: "Grow",
    icon: "chart" as const,
  },
  {
    id: "workspaces",
    title: "Role-true workspaces",
    body: "Super Admin, Client, and Team User each get a lane. The network is shared; the control is not.",
    tag: "Grow",
    icon: "users" as const,
  },
] as const;

export const LANDING_CAROUSEL_SLIDES = [
  {
    id: "drop",
    step: "01",
    title: "Drop the list",
    body: "CSV, XLSX, or a document. The first act is adding — a file becomes a field of points.",
    cue: "Add",
  },
  {
    id: "scrub",
    step: "02",
    title: "Scrub every address",
    body: "MX, DNS, and SMTP filters decide who can be joined. Invalid inboxes never reach a campaign.",
    cue: "Connect",
  },
  {
    id: "compose",
    step: "03",
    title: "Compose once",
    body: "A template is the message. A verified segment is the audience. They meet only after the list is clean.",
    cue: "Connect",
  },
  {
    id: "broadcast",
    step: "04",
    title: "Broadcast the join",
    body: "Delivery is the line between a campaign and a person. This is Integrate in motion.",
    cue: "Connect",
  },
  {
    id: "read",
    step: "05",
    title: "Read the growth",
    body: "Sent, opened, bounced. The next upload starts the loop again — keep adding, keep connecting, keep growing.",
    cue: "Grow",
  },
] as const;
