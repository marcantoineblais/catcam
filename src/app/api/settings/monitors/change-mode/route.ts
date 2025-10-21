import { SERVER_URL } from "@/src/config";
import { getToken } from "@/src/libs/jwt";
import { withAdminRole } from "@/src/libs/withAdmin";
import { NextRequest, NextResponse } from "next/server";

export const POST = withAdminRole(async (request: NextRequest) => {
  try {
    const token = await getToken();
    if (!token || !token.authToken) {
      return NextResponse.json(
        { ok: false, message: "unauthorized" },
        { status: 401 }
      );
    }

    const { monitorId, monitorMode } = await request.json();
    const url = new URL(
      `${token.authToken}/monitor/${token.groupKey}/${monitorId}/${monitorMode}`,
      SERVER_URL
    );

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        "Failed to update monitor " + monitorId + ": " + response.statusText
      );
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (error) {
    console.error("[Update Monitor] Error updating monitor:", error);
    return NextResponse.json(
      { ok: false, message: "Update to monitor failed" },
      { status: 500 }
    );
  }
});
