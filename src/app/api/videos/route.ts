"use server";

import { fetchVideos } from "@/src/utils/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  try {
    const videos = await fetchVideos(searchParams); 
    return NextResponse.json(videos);
  } catch (ex) {
    return NextResponse.error();
  }
}
