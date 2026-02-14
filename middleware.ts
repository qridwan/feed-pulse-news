import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const LOGIN_PATH = "/admin/login";

function isPublicAdminPath(pathname: string): boolean {
  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
}

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    if (isPublicAdminPath(pathname)) {
      if (process.env.NODE_ENV === "development") {
        console.log("[middleware] Public path allowed:", pathname);
      }
      return NextResponse.next();
    }
    if (req.nextauth.token) {
      if (process.env.NODE_ENV === "development") {
        console.log("[middleware] Authenticated:", pathname);
      }
      return NextResponse.next();
    }
    if (process.env.NODE_ENV === "development") {
      console.log("[middleware] Unauthenticated, redirect to login:", pathname);
    }
    const loginUrl = new URL(LOGIN_PATH, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  },
  {
    pages: { signIn: LOGIN_PATH },
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
