import Cookies from "js-cookie";
import type { Role } from "./types";

// NOTE (production hardening): these cookies are set client-side with
// js-cookie, so they are readable by any JS running on the page (not
// httpOnly). That's acceptable for this scaffold, but a real deployment
// should move login behind a Next.js Route Handler that proxies to the
// backend and sets an httpOnly, Secure, SameSite=strict cookie instead of
// exposing the JWT to client-side JS at all.

const TOKEN_COOKIE = "eb_token";
const ROLE_COOKIE = "eb_role";
const USERNAME_COOKIE = "eb_username";
const USERID_COOKIE = "eb_userid";

const COOKIE_OPTS = { expires: 1, sameSite: "lax" as const };

export interface Session {
  token: string;
  role: Role;
  id: number;
  username: string;
}

export function setSession(session: Session): void {
  Cookies.set(TOKEN_COOKIE, session.token, COOKIE_OPTS);
  Cookies.set(ROLE_COOKIE, session.role, COOKIE_OPTS);
  Cookies.set(USERNAME_COOKIE, session.username, COOKIE_OPTS);
  Cookies.set(USERID_COOKIE, String(session.id), COOKIE_OPTS);
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE);
}

export function getRole(): Role | undefined {
  return Cookies.get(ROLE_COOKIE) as Role | undefined;
}

export function getUsername(): string | undefined {
  return Cookies.get(USERNAME_COOKIE);
}

export function getUserId(): number | undefined {
  const raw = Cookies.get(USERID_COOKIE);
  return raw ? Number(raw) : undefined;
}

export function logout(): void {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(ROLE_COOKIE);
  Cookies.remove(USERNAME_COOKIE);
  Cookies.remove(USERID_COOKIE);
}

export function roleHomePath(role: Role): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "CLIENT":
      return "/client/dashboard";
    case "USER":
      return "/user/dashboard";
    default:
      return "/";
  }
}

export function roleLoginPath(role: Role): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/login/super-admin";
    case "CLIENT":
      return "/login/client";
    case "USER":
      return "/login/user";
    default:
      return "/";
  }
}
