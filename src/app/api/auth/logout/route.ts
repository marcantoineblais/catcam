import { SESSION_COOKIE_NAME } from "@/src/config";
import { NextResponse } from "next/server";

export function GET() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
