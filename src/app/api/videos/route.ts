import { getToken } from "@/src/libs/jwt";
import { ShinobiService } from "@/src/services/shinobi-service";
import { NextRequest, NextResponse } from "next/server";

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
