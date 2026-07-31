import Cookies from "js-cookie";
import type { Role, Session } from "@/types";
import { ROUTES } from "@/constants/routes.constants";

// Production note: prefer httpOnly Secure cookies via a Next.js BFF Route Handler.
const TOKEN_COOKIE = "eb_token";
const ROLE_COOKIE = "eb_role";
const USERNAME_COOKIE = "eb_username";
const USERID_COOKIE = "eb_userid";

const COOKIE_OPTS = { expires: 1, sameSite: "lax" as const };

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
      return ROUTES.superAdmin.dashboard;
    case "CLIENT":
      return ROUTES.client.dashboard;
    case "USER":
      return ROUTES.user.dashboard;
    default:
      return ROUTES.home;
  }
}

export function roleLoginPath(role: Role): string {
  switch (role) {
    case "SUPER_ADMIN":
      return ROUTES.login.superAdmin;
    case "CLIENT":
      return ROUTES.login.client;
    case "USER":
      return ROUTES.login.user;
    default:
      return ROUTES.home;
  }
}
