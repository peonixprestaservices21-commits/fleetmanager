import { NextResponse } from "next/server";

export function middleware(req) {
  const isLoggedIn = req.cookies.get("fleet_auth")?.value === "1";
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login");

  if (isLoggedIn || isPublic) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
