import { NextResponse } from "next/server";

export function GET() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
