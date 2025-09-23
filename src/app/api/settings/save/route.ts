import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/src/utils/jwt";
import { write } from "fs";
import { writeSettings } from "@/src/utils/settings";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ isServerAction: true });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const { home, camera, quality, mode } = await request.json();
    const settings = await writeSettings({
      home,
      camera,
      quality,
      mode,
      email: token.email,
    });
    
    return NextResponse.json(
      { message: "Settings saved", settings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
