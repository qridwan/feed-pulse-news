import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const LOGIN_PATH = "/admin/login";

function isPublicAdminPath(pathname: string): boolean {
  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicAdminPath(pathname)) {
    if (process.env.NODE_ENV === "development") {
      console.log("[proxy] Public path allowed:", pathname);
    }
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    if (process.env.NODE_ENV === "development") {
      console.log("[proxy] Authenticated:", pathname);
    }
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[proxy] Unauthenticated, redirect to login:", pathname);
  }
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
