export default function imageLoader({
  src,
  width,
  quality,
}: {
  src?: string;
  width?: number;
  quality?: number;
}) {
  if (!src) return window.location.origin;
  
  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (quality) params.set("q", quality.toString());

  return `${window.location.origin}/${src}?${params}`;
}
