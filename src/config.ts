export const isProd = process.env.NODE_ENV === "production";
export const DOMAIN_NAME = process.env.DOMAIN_NAME!;
export const SERVER_URL = process.env.SERVER_URL!;
export const AUTO_DARK_MODE_TIME = { start: 19, end: 7 };
export const DEFAULT_SETTINGS = {
  mode: "light",
  home: "/live",
  camera: "",
  quality: "HQ",
};
export const STREAM_EXT = "s.m3u8";
export const SERVER_TIMEZONE = process.env.SERVER_TIMEZONE || "UTC";

export const SESSION_COOKIE_NAME = isProd ? "__Secure_session" : "session";
export const CSRF_COOKIE_NAME = isProd ? "__Secure_csrf" : "csrf";
export const CSRF_HEADER_NAME = "X-CSRF-Token";

export const CSRF_TOKEN_SECRET = process.env.CSRF_TOKEN_SECRET!;
export const JWT_SIGN_SECRET = new TextEncoder().encode(
  process.env.JWT_SIGN_SECRET!,
);
export const JWT_ISSUER = "catcam_app";
