import { getServerSession as getNextAuthSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "./config";

export type AuthSession = Session;

/**
 * Get the current session on the server (Server Components, API routes, Server Actions).
 */
export async function getServerSession(): Promise<AuthSession | null> {
  return getNextAuthSession(authOptions);
}

/**
 * Get the current admin user from the session.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthSession["user"] | null> {
  const session = await getNextAuthSession(authOptions);
  return session?.user ?? null;
}

/**
 * Require authentication. Throws if no session; returns the session user otherwise.
 * Use in API routes or Server Actions that must be admin-only.
 */
export async function requireAuth(): Promise<AuthSession["user"]> {
  const session = await getNextAuthSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export { authOptions } from "./config";
