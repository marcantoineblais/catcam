import { isProd } from "@/src/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { home, camera, quality, mode } = await request.json();
  const response = NextResponse.json({ ok: true });

  ["home", "camera", "quality", "mode"].forEach((key) => {
    const value = { home, camera, quality, mode }[key as string];
    if (value) {
      response.cookies.set(key, value, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });
    }
  });

  return response;
}
