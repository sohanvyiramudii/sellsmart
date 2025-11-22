import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token");

  const protectedPaths = ["/dashboard", "/admin"];

  if (protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
