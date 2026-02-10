/**
 * Loader for Next/Image that points to our /api/image route.
 * baseUrl comes from ConfigContext (runtime) so it works per-deployment.
 */
export default function imageLoader({
  src,
  width,
  height,
  quality,
  baseUrl = "",
}: {
  src?: string;
  width?: number;
  height?: number;
  quality?: number;
  baseUrl?: string;
}) {
  if (!src) return baseUrl;

  const params = new URLSearchParams();
  params.set("path", src);
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  if (quality) params.set("q", quality.toString());

  return `${baseUrl}/api/image?${params}`;
}
