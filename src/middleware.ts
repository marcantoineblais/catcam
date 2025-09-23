import { NextRequest, NextResponse } from "next/server";
import { getToken } from "./utils/jwt";

const publicRoutes = ["/login", "/api/auth/login", "/api/auth/session"];

export async function middleware(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;
  if (publicRoutes.includes(requestedPath)) {
    return NextResponse.next();
  }

  try {
    const token = await getToken();
    if (!token?.authToken) throw new Error("No auth token in token");

    return NextResponse.next();
  } catch (_) {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;

    const response = NextResponse.redirect(new URL("/login", origin));
    response.cookies.set("session", "", {
      path: "/",
      maxAge: 0,
    });

    return response;
  }
}

export const config = {
  matcher:
    "/((?!_next|\\.well-known|favicon.ico|manifest.webmanifest).*)",
};
