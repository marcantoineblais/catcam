export const isProd = process.env.NODE_ENV === "production";
export const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME!;
export const SERVER_URL = process.env.SERVER_URL!;
export const AUTO_DARK_MODE_TIME = { start: 19, end: 7 };
export const DEFAULT_SETTINGS = {
  mode: "light",
  home: "/live",
  camera: "",
  quality: "HQ",
};
export const SESSION_COOKIE_NAME = isProd ? "__Secure_session" : "session";
