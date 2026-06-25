import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authRoutes = [
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
  "/otp",
  "/reset-password",
];

const protectedPrefixes = ["/profile", "/category"];
const partnerOnlyPrefixes = ["/profile/services", "/category"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedPrefixes.some((route) =>
    pathname.startsWith(route),
  );
  const isPartnerOnlyRoute = partnerOnlyPrefixes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (token && isPartnerOnlyRoute && token.role !== "find job") {
    return NextResponse.redirect(new URL("/profile/bookings", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/register",
    "/forgot-password",
    "/otp",
    "/reset-password",
    "/profile/:path*",
    "/category",
  ],
};
