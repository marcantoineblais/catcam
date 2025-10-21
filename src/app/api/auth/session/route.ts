import { SessionService } from "@/src/services/session-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await SessionService.getSession();

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ ok: false, session: null });
  }
}
