// ============================================================
// src/middleware.ts — Route protection & role-based access
// ============================================================
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  // Public routes — always accessible
  const publicRoutes = ["/", "/login", "/register", "/api/auth", "/api/properties"];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  // Dashboard routes require authentication
  if (pathname.startsWith("/dashboard")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), nextUrl));
    }

    // Owner-only routes
    if (pathname.startsWith("/dashboard/owner") && session.user.role !== "owner" && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    // Tenant-only routes
    if (pathname.startsWith("/dashboard/tenant") && session.user.role !== "tenant" && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    // Admin-only routes
    if (pathname.startsWith("/dashboard/admin") && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  // Protected API routes
  const protectedApis = [
    "/api/bookings",
    "/api/favorites",
    "/api/stats",
    "/api/admin",
    "/api/users",
  ];
  const isProtectedApi = protectedApis.some((r) => pathname.startsWith(r));
  if (isProtectedApi && !session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
