import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = body.name;
  const value = body.value;
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: name,
    value: value,
    maxAge: 1000 * 60 * 60 * 24 * 365,
    path: "/",
  });

  return response;
}
