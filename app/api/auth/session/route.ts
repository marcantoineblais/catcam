import { NextResponse } from "next/server";

import { SessionService } from "@/services/session-service";

export async function GET() {
  try {
    const session = await SessionService.getSession();

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ ok: false, session: null });
  }
}
