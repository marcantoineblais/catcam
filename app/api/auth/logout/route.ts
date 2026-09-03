import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/app/config";

export function GET(request: NextRequest) {
  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = "/login";
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
