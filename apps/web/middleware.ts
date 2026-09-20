import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "nexus_token";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/chat",
  "/workflow",
  "/workspace",
  "/settings",
  "/billing",
  "/notifications",
  "/profile",
  "/analytics",
  "/reports",
];

// Routes that are only for unauthenticated users (redirect to dashboard if logged in)
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

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
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid cookie
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
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public assets
     * - /api/auth/*   (auth API routes themselves)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api/auth).*)",
  ],
};
