import { NextResponse } from "next/server";

import { getSession } from "@/services/session-service";

export async function GET() {
  try {
    const { session, error } = await getSession();
    if (error) {
      throw new Error("Token is invalid or expired");
    }

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.redirect("/api/auth/logout");
  }
}
