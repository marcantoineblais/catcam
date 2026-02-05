import { DOMAIN_NAME, SERVER_URL } from "@/src/config";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const w = request.nextUrl.searchParams.get("w");
  const h = request.nextUrl.searchParams.get("h");
  const q = request.nextUrl.searchParams.get("q");

  if (!path) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const width = w ? parseInt(w, 10) : undefined;
  const height = h ? parseInt(h, 10) : undefined;
  const quality = q ? Math.min(100, Math.max(1, parseInt(q, 10))) : 80;

  if (width !== undefined && (Number.isNaN(width) || width < 1 || width > 2000)) {
    return NextResponse.json({ error: "Invalid width" }, { status: 400 });
  }
  if (height !== undefined && (Number.isNaN(height) || height < 1 || height > 2000)) {
    return NextResponse.json({ error: "Invalid height" }, { status: 400 });
  }

  const upstreamUrl = `${SERVER_URL}/${path}`;
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const upstream = await fetch(upstreamUrl, { headers });
  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status });
  }

  const buffer = Buffer.from(await upstream.arrayBuffer());
  if (buffer.length === 0) {
    return new NextResponse(null, { status: 502 });
  }

  let result: Buffer;
  try {
    let pipeline = sharp(buffer);
    if (width !== undefined || height !== undefined) {
      pipeline = pipeline.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    result = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  } catch {
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(Buffer.from(result), {
    headers: {
      "content-type": "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
