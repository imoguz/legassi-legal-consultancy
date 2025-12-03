import { NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken");
  const hasRefreshToken = !!refreshToken?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = pathname.startsWith("/auth/");
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Auth routes
  if (hasRefreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protected routes
  if (!hasRefreshToken && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
