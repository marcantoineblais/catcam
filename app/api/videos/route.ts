import { NextRequest, NextResponse } from "next/server";

import { getToken } from "@/libs/jwt";
import { ShinobiService } from "@/services/shinobi-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();

  try {
    const token = await getToken();
    if (!token?.authToken || !token?.groupKey) throw new Error("No token");

    const videos = await ShinobiService.getVideos({
      authToken: token.authToken,
      groupKey: token.groupKey,
      searchParams,
    });
    return NextResponse.json(videos);
  } catch (ex) {
    console.error("[Videos] Error fetching videos:", ex);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
