import type { UserRole } from "@nexus/types";

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
  expiresAt: number;
}

export function createSessionToken(session: Omit<AuthSession, "expiresAt">): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = JSON.stringify({ ...session, expiresAt });
  // Base64 encoding token for lightweight auth session transport
  const token = typeof btoa !== "undefined" 
    ? btoa(payload) 
    : Buffer.from(payload).toString("base64");
  
  return { token, expiresAt };
}

export function parseSessionToken(token: string): AuthSession | null {
  try {
    const raw = typeof atob !== "undefined"
      ? atob(token)
      : Buffer.from(token, "base64").toString("utf-8");
    const session = JSON.parse(raw) as AuthSession;
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    SYSTEM: 4,
    ADMIN: 3,
    MEMBER: 2,
    GUEST: 1,
  };
  return (hierarchy[userRole] || 0) >= (hierarchy[requiredRole] || 0);
}
