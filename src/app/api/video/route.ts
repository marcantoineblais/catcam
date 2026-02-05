import { SERVER_URL } from "@/src/config";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies video requests to SERVER_URL with headers required for seeking.
 * Path is passed as a query param (same pattern as /api/image).
 * Forwards: Cookie (auth), Range, If-Range.
 */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path || path.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const url = `${SERVER_URL}/${path}`;
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const range = request.headers.get("range");
  if (range) headers.set("range", range);
  const ifRange = request.headers.get("if-range");
  if (ifRange) headers.set("if-range", ifRange);

  const upstream = await fetch(url, { headers });

  if (!upstream.ok) {
    return new NextResponse(null, {
      status: upstream.status,
      statusText: upstream.statusText,
    });
  }

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) responseHeaders.set("content-length", contentLength);
  responseHeaders.set(
    "accept-ranges",
    upstream.headers.get("accept-ranges") ?? "bytes",
  );
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) responseHeaders.set("content-range", contentRange);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
