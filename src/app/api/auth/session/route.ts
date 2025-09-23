import { fetchSession } from "@/src/utils/fetch";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await fetchSession();

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ ok: false, session: null });
  }
}
