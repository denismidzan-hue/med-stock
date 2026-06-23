import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is an admin route (except login)
  if (path.startsWith("/admin") && path !== "/login") {
    const authCookie = request.cookies.get("admin-auth");

    if (!authCookie || authCookie.value !== "true") {
      // Redirect to login page
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
