import type { NextRequest } from "next/server";
import type { AuthSession } from "./index";
import { getServerSession } from "./index";

export type ApiRouteHandler<T = unknown> = (
  req: NextRequest,
  context: { params?: T }
) => Promise<Response> | Response;

/**
 * Wraps an API route handler to require authentication.
 * If the user is not authenticated, returns 401 with a JSON body.
 * The handler receives the same (req, context); use getServerSession() or getCurrentUser() inside the handler to get the user.
 */
export function withAuth<T = unknown>(
  handler: ApiRouteHandler<T>
): ApiRouteHandler<T> {
  return async (req: NextRequest, context: { params?: T }) => {
    const session = await getServerSession();
    if (!session?.user) {
      if (process.env.NODE_ENV === "development") {
        console.log("[withAuth] Unauthenticated API request:", req.nextUrl.pathname);
      }
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return handler(req, context);
  };
}

/**
 * Throws if the current request has no authenticated admin session.
 * Use in API routes or Server Actions. Returns the session user when authenticated.
 */
export async function requireAdmin(): Promise<AuthSession["user"]> {
  const session = await getServerSession();
  if (!session?.user) {
    if (process.env.NODE_ENV === "development") {
      console.log("[requireAdmin] No session");
    }
    throw new Error("Unauthorized");
  }
  return session.user;
}
