import sharp from "sharp";

import { LOGO_PATHS, LOGO_SIZE } from "@/libs/logo";
import { MARK, PWA_ASSETS, PWA_THEMES, PwaAsset, PwaTheme } from "@/libs/pwa";

// Every image is drawn once at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PWA_ASSETS).map((asset) => ({ asset }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ asset: string }> },
) {
  const { asset } = await params;
  const image = PWA_ASSETS[asset];
  const svg = image.kind === "icon" ? drawIcon(image) : drawSplash(image);

  if (image.kind === "icon" && image.format === "svg") {
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
  }

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}

function drawLogo(x: number, y: number, size: number, color: string) {
  const paths = LOGO_PATHS.map((d) => `<path d="${d}"/>`).join("");
  return `<g fill="${color}" transform="translate(${x} ${y}) scale(${size / LOGO_SIZE})">${paths}</g>`;
}

// Rounded primary square with a soft top highlight and the logo centered
function drawMark(
  x: number,
  y: number,
  size: number,
  radius: number,
  logo: number,
  theme: PwaTheme = "light",
) {
  const { primary, primaryForeground } = PWA_THEMES[theme];
  const logoSize = size * logo;
  const offset = (size - logoSize) / 2;

  return `
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" fill="${primary}"/>
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" fill="url(#sheen)"/>
    ${drawLogo(x + offset, y + offset, logoSize, primaryForeground)}`;
}

const SHEEN = `
  <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.12"/>
    <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>`;

function drawIcon({ size, shape }: Extract<PwaAsset, { kind: "icon" }>) {
  const radius = shape === "rounded" ? size * MARK.radius : 0;
  const logo = shape === "maskable" ? 0.64 : MARK.logo;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>${SHEEN}</defs>
    ${drawMark(0, 0, size, radius, logo)}
  </svg>`;
}

// Launch screen matching the first frame of the in-app splash
function drawSplash({
  width,
  height,
  scale,
  theme,
}: Extract<PwaAsset, { kind: "splash" }>) {
  const { background, primary, shadowOpacity } = PWA_THEMES[theme];
  const size = MARK.splashSize * scale;
  const radius = size * MARK.radius;
  const x = (width - size) / 2;
  const y = (height - size) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      ${SHEEN}
      <radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="${width / 2}" cy="${height / 2}" r="${448 * scale}">
        <stop offset="0" stop-color="${primary}" stop-opacity="0.16"/>
        <stop offset="0.7" stop-color="${primary}" stop-opacity="0"/>
      </radialGradient>
      <filter id="shadow" x="-1" y="-1" width="3" height="3">
        <feGaussianBlur stdDeviation="${20 * scale}"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="${background}"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    <rect x="${x + 12 * scale}" y="${y + 30 * scale}" width="${size - 24 * scale}" height="${size - 24 * scale}" rx="${radius}" fill="${primary}" opacity="${shadowOpacity}" filter="url(#shadow)"/>
    ${drawMark(x, y, size, radius, MARK.logo, theme)}
  </svg>`;
}
