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
  if (!src) return window.location.origin;

  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  if (quality) params.set("q", quality.toString());

  return `${window.location.origin}/${src}?${params}`;
}
