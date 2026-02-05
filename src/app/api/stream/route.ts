import { DOMAIN_NAME, SERVER_URL } from "@/src/config";
import { NextRequest, NextResponse } from "next/server";

const MANIFEST_TYPES = [
  "application/vnd.apple.mpegurl",
  "application/x-mpegurl",
  "text/plain",
];

/**
 * Proxies HLS livestream requests to SERVER_URL (manifests .m3u8 and segments .ts).
 * Path is passed as a query param (same pattern as /api/image and /api/video).
 * Forwards: Cookie (auth), Range for segment requests.
 * Rewrites manifest content so relative segment URLs go through this proxy.
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

  const upstream = await fetch(url, { headers });

  if (!upstream.ok) {
    return new NextResponse(null, {
      status: upstream.status,
      statusText: upstream.statusText,
    });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  const isManifest =
    path.endsWith(".m3u8") ||
    MANIFEST_TYPES.some((t) => contentType.includes(t));

  if (isManifest) {
    const basePath = path.includes("/") ? path.slice(0, path.lastIndexOf("/") + 1) : "";
    const text = await upstream.text();
    const baseUrl = `${DOMAIN_NAME}/api/stream`;
    const lines = text.split(/\r?\n/);
    const rewritten = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return line;
      const segmentPath = basePath + trimmed;
      return `${baseUrl}?path=${encodeURIComponent(segmentPath)}`;
    });
    const body = rewritten.join("\n");
    return new NextResponse(body, {
      status: 200,
      headers: {
        "content-type": "application/vnd.apple.mpegurl",
      },
    });
  }

  const responseHeaders = new Headers();
  if (contentType) responseHeaders.set("content-type", contentType);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) responseHeaders.set("content-length", contentLength);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
