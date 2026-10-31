// Images of the installed app: home screen icons, favicon and iOS launch
// screens. They are drawn by app/pwa/[asset]/route.ts and served under /pwa/.

// Keep in sync with the color tokens and splash styles in app/globals.css
export const PWA_THEMES = {
  light: {
    background: "#f7f6f4",
    primary: "#b8541a",
    primaryForeground: "#ffffff",
    shadowOpacity: 0.5,
  },
  dark: {
    background: "#0f0e0d",
    primary: "#f08a3e",
    primaryForeground: "#1c1006",
    shadowOpacity: 0.35,
  },
};

export type PwaTheme = keyof typeof PWA_THEMES;

// Brand mark: logo on a rounded primary square. The launch screens show it
// at the same size and spot as the in-app splash (.cc-splash-mark).
export const MARK = {
  splashSize: 104,
  radius: 0.27,
  logo: 0.76,
};

// rounded: the mark as is. square: full bleed, for iOS which rounds the
// corners itself. maskable: full bleed, logo inside the 80% safe zone.
export type PwaAsset =
  | {
      kind: "icon";
      size: number;
      shape: "rounded" | "square" | "maskable";
      format: "png" | "svg";
    }
  | {
      kind: "splash";
      width: number;
      height: number;
      scale: number;
      theme: PwaTheme;
    };

const ICONS: Record<string, PwaAsset> = {
  "icon.svg": { kind: "icon", size: 512, shape: "rounded", format: "svg" },
  "icon-192.png": { kind: "icon", size: 192, shape: "rounded", format: "png" },
  "icon-512.png": { kind: "icon", size: 512, shape: "rounded", format: "png" },
  "icon-maskable-512.png": {
    kind: "icon",
    size: 512,
    shape: "maskable",
    format: "png",
  },
  "apple-touch-icon.png": {
    kind: "icon",
    size: 180,
    shape: "square",
    format: "png",
  },
};

// Portrait screen size (CSS px) and pixel ratio of each iPhone and iPad
const APPLE_SCREENS = [
  [440, 956, 3], // iPhone 16 Pro Max, 17 Pro Max
  [420, 912, 3], // iPhone Air
  [402, 874, 3], // iPhone 16 Pro, 17, 17 Pro
  [430, 932, 3], // iPhone 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus
  [393, 852, 3], // iPhone 14 Pro, 15, 15 Pro, 16
  [428, 926, 3], // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
  [390, 844, 3], // iPhone 12, 12 Pro, 13, 13 Pro, 14, 16e
  [375, 812, 3], // iPhone X, XS, 11 Pro, 12 mini, 13 mini
  [414, 896, 3], // iPhone XS Max, 11 Pro Max
  [414, 896, 2], // iPhone XR, 11
  [414, 736, 3], // iPhone 6s Plus, 7 Plus, 8 Plus
  [375, 667, 2], // iPhone 6s, 7, 8, SE (2nd and 3rd gen)
  [320, 568, 2], // iPhone SE (1st gen)
  [1032, 1376, 2], // iPad Pro 13"
  [1024, 1366, 2], // iPad Pro 12.9", iPad Air 13"
  [834, 1210, 2], // iPad Pro 11" (M4 and later)
  [834, 1194, 2], // iPad Pro 11"
  [834, 1112, 2], // iPad Air 10.5", iPad Pro 10.5"
  [820, 1180, 2], // iPad Air 10.9" and 11", iPad 10th gen and later
  [810, 1080, 2], // iPad 10.2"
  [768, 1024, 2], // iPad 9.7", iPad mini 5
  [744, 1133, 2], // iPad mini 6 and later
] as const;

const SPLASH_SCREENS = APPLE_SCREENS.flatMap(([width, height, scale]) =>
  (["portrait", "landscape"] as const).flatMap((orientation) =>
    (["light", "dark"] as const).map((theme) => {
      const [w, h] =
        orientation === "portrait" ? [width, height] : [height, width];
      const asset: PwaAsset = {
        kind: "splash",
        width: w * scale,
        height: h * scale,
        scale,
        theme,
      };

      return {
        name: `splash-${w * scale}x${h * scale}-${theme}.png`,
        media:
          `screen and (device-width: ${width}px) and (device-height: ${height}px)` +
          ` and (-webkit-device-pixel-ratio: ${scale}) and (orientation: ${orientation})` +
          ` and (prefers-color-scheme: ${theme})`,
        asset,
      };
    }),
  ),
);

export const PWA_ASSETS: Record<string, PwaAsset> = {
  ...ICONS,
  ...Object.fromEntries(SPLASH_SCREENS.map(({ name, asset }) => [name, asset])),
};

export const APPLE_STARTUP_IMAGES = SPLASH_SCREENS.map(({ name, media }) => ({
  url: `/pwa/${name}`,
  media,
}));
