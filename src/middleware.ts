import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "localfix-secret-key-12345",
  });

  const { pathname } = req.nextUrl;

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (token.role !== "ADMIN") {
      // Redirect to customer dashboard if not authorized
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect /provider-dashboard
  if (pathname.startsWith("/provider-dashboard")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (token.role !== "PROVIDER") {
      // Redirect to customer dashboard if not authorized
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/provider-dashboard/:path*",
    "/dashboard/:path*",
  ],
};
