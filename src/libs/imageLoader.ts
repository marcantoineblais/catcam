import { DOMAIN_NAME } from "../config";

/**
 * Loader for Next/Image that points to our /api/image route.
 * Returns a resized/optimized image.
 */
export default function imageLoader({
  src,
  width,
  height,
  quality,
}: {
  src?: string;
  width?: number;
  height?: number;
  quality?: number;
}) {
  if (!src) return DOMAIN_NAME;

  const params = new URLSearchParams();
  params.set("path", src);
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  if (quality) params.set("q", quality.toString());

  return `${DOMAIN_NAME}/api/image?${params}`;
}
