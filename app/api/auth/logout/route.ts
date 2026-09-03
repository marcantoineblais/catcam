import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/app/config";
import { getRedirectUrl } from "@/libs/redirect";

export function GET() {
  const response = NextResponse.redirect(getRedirectUrl("/login"));
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
