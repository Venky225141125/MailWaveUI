import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NOTE: Next.js 16 renamed the `middleware.ts` file convention to
// `proxy.ts` (same runtime, same semantics, just a rename to avoid
// confusion with Express-style middleware). This file is the auth-guard
// equivalent of what the spec calls "src/middleware.ts".

const ROLE_HOME: Record<string, string> = {
  SUPER_ADMIN: "/super-admin/dashboard",
  CLIENT: "/client/dashboard",
  USER: "/user/dashboard",
};

const ROLE_LOGIN: Record<string, string> = {
  SUPER_ADMIN: "/login/super-admin",
  CLIENT: "/login/client",
  USER: "/login/user",
};

// Real URL prefix -> required role. Route groups like (super-admin) don't
// change the URL, and three roles all wanting "/dashboard" would collide
// at the file-system routing level, so each role gets its own top-level
// URL segment instead (still organized as its own layout/section).
const PROTECTED_PREFIXES: Array<{ prefix: string; role: string }> = [
  { prefix: "/super-admin", role: "SUPER_ADMIN" },
  { prefix: "/client", role: "CLIENT" },
  { prefix: "/user", role: "USER" },
];

const AUTH_PREFIXES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("eb_role")?.value;

  const protectedMatch = PROTECTED_PREFIXES.find((p) =>
    pathname.startsWith(p.prefix)
  );
  if (protectedMatch) {
    if (!role) {
      const loginPath = ROLE_LOGIN[protectedMatch.role] ?? "/";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
    if (role !== protectedMatch.role) {
      const home = ROLE_HOME[role] ?? "/";
      return NextResponse.redirect(new URL(home, request.url));
    }
    return NextResponse.next();
  }

  if (AUTH_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (role && ROLE_HOME[role]) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/client/:path*",
    "/user/:path*",
    "/login/:path*",
    "/register/:path*",
  ],
};

// export function proxy(request: NextRequest) {
//   return NextResponse.next();
// }
