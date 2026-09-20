import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "nexus_token";

// Cache the encoded secret — avoids re-encoding on every middleware call
let _cachedSecret: Uint8Array | null = null;
function getSecret(): Uint8Array {
  if (_cachedSecret) return _cachedSecret;
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  _cachedSecret = new TextEncoder().encode(secret);
  return _cachedSecret;
}
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/chat",
  "/workflow",
  "/workflows",
  "/workspace",
  "/agents",
  "/projects",
  "/settings",
  "/billing",
  "/notifications",
  "/profile",
  "/analytics",
  "/reports",
  "/storage",
  "/search",
  "/knowledge-graph",
  "/memory",
  "/calendar",
  "/integrations",
  "/organization",
  "/admin",
  "/developer",
  "/help",
];

// Routes only for unauthenticated users (redirect to /dashboard if already logged in)
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // ── Protected route without valid token → redirect to /login ────────────
  if (isProtected) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const valid = await verifyToken(token);
    if (!valid) {
      // Invalid/expired token — clear cookie and send to login cleanly (no loop)
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // ── Auth routes with a valid token → redirect to /dashboard ─────────────
  if (isAuthRoute && token) {
    const valid = await verifyToken(token);
    if (valid) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Only run middleware on ACTUAL page routes.
     * Exclude:
     *  - _next/static   (JS/CSS bundles — massive perf win)
     *  - _next/image    (image optimisation)
     *  - _next/data     (RSC data payloads — already protected by page)
     *  - favicon.ico / public assets
     *  - api/auth       (auth routes handle their own auth)
     *  - Root / (landing page — always public)
     */
    "/((?!_next|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$|api/auth)(?!$).+)",
  ],
};
