import { NextRequest, NextResponse } from "next/server";

import { getToken } from "./libs/jwt";
import { getRedirectUrl } from "./libs/redirect";
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
      return NextResponse.redirect(getRedirectUrl(userLandingPage));
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

    return NextResponse.redirect(getRedirectUrl("/login"));
  }
}

export const config = {
  matcher:
    "/((?!_next|\\.well-known|favicon.ico|manifest.webmanifest|robots.txt).*)",
};
