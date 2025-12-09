import { NextRequest, NextResponse } from "next/server";
import { getToken } from "./libs/jwt";

const publicRoutes = [
  "/login",
  "/logout",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/session",
];

export async function proxy(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;
  if (publicRoutes.includes(requestedPath)) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", requestedPath);
    return response;
  }

  try {
    const token = await getToken();
    if (!token?.authToken) throw new Error("No auth token");

    const response = NextResponse.next();
    response.headers.set("x-pathname", requestedPath);
    return response;
  } catch (error) {
    console.error("[PROXY] Unauthorized access to", requestedPath, error);
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;

    return NextResponse.redirect(new URL("/login", origin));
  }
}

export const config = {
  matcher: "/((?!_next|\\.well-known|favicon.ico|manifest.webmanifest|robots.txt).*)",
};
