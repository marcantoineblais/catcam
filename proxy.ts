import { NextRequest, NextResponse } from "next/server";

import { getToken } from "./libs/jwt";
import { getSettings } from "./services/settings-service";

const publicRoutes = ["/login", "/api/auth/login", "/api/auth/session"];

export async function proxy(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;
  if (publicRoutes.includes(requestedPath)) {
    return NextResponse.next();
  }

  try {
    const token = await getToken();
    if (!token) throw new Error("No token found");

    if (requestedPath === "/") {
      const settings = await getSettings(token.email);
      const userLandingPage = settings?.home || "/live";
      const redirectUrl = new URL(request.url);
      redirectUrl.pathname = userLandingPage;
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch (error) {
    const isApiRequest = requestedPath.startsWith("/api/");
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `[PROXY] Unauthorized access to: ${requestedPath}. Error: ${errorMessage}`,
    );
    if (isApiRequest) {
      return NextResponse.json(
        { ok: false, message: "unauthorized" },
        { status: 401 },
      );
    }

    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher:
    "/((?!_next|\\.well-known|favicon.ico|manifest.webmanifest|robots.txt).*)",
};
