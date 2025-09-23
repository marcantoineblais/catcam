import { cookies, headers } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const ISSUER = "catcam_app";
const JWT_SIGN_SECRET = new TextEncoder().encode(process.env.JWT_SIGN_SECRET!);
const isProd = process.env.NODE_ENV === "production";

export async function getToken({ isServerAction = false } = {}) {
  const cookie = await cookies();

  try {
    const signedToken = cookie.get("session")?.value;
    if (!signedToken) return null;

    const { payload } = await jwtVerify(signedToken, JWT_SIGN_SECRET, {
      issuer: ISSUER,
      clockTolerance: 60,
    });

    const uaClaim = await normalisedUA();
    if (payload.ua !== uaClaim) {
      console.warn("[GetToken] User-Agent mismatch, revoking token");
      throw new Error("invalidToken");
    }

    const now = Math.floor(Date.now() / 1000);
    if (
      !isServerAction &&
      typeof payload.renewAt === "number" &&
      payload.renewAt < now &&
      payload.sub &&
      payload.aud
    ) {
      await createToken({
        authToken: payload.sub,
        groupKey: payload.aud as string,
        rememberMe: true,
      });
    }
    return { authToken: payload.sub, groupKey: payload.aud as string };
  } catch (error) {
    console.error("[GetToken] Error validating token:", error);
    cookie.delete("session");
    throw error;
  }
}

export async function createToken({
  authToken,
  groupKey,
  rememberMe,
}: {
  authToken: string;
  groupKey: string;
  rememberMe: boolean;
}) {
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    sub: authToken,
    aud: groupKey,
    iat: now, // Issued at
    exp: now + 7 * 24 * 60 * 60, // Expires in 7 days
    jti: crypto.randomUUID(), // Unique identifier for the token
    ua: await normalisedUA(),
    renewAt: now + 1 * 24 * 60 * 60, // Can renew in 1 day
  };

  try {
    const cookie = await cookies();
    const signedToken = await new SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(ISSUER)
      .sign(JWT_SIGN_SECRET);

    cookie.set("session", signedToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : undefined, // 7 days or session
    });
  } catch (error) {
    console.error("[CreateToken] Error signing JWT:", error);
    throw new Error("tokenGenerationFailed");
  }
}

async function normalisedUA() {
  const header = await headers();
  const ua = header.get("User-Agent");

  // Dev mode override
  if (process.env.NODE_ENV !== "production") {
    return await sha256Hex("dev;dev");
  }

  if (!ua) {
    console.warn("[normalizeUA] No User-Agent header found");
    return await sha256Hex("unknown;unknown");
  }

  const lower = ua.toLowerCase();

  // Broader browser detection
  const browser = lower.includes("chrome")
    ? "chrome"
    : lower.includes("edg")
    ? "edge"
    : lower.includes("safari") && !lower.includes("chrome")
    ? "safari"
    : lower.includes("firefox")
    ? "firefox"
    : lower.includes("opera")
    ? "opera"
    : "unknown";

  // OS detection
  const os = lower.includes("windows")
    ? "windows"
    : lower.includes("mac os x")
    ? "macos"
    : lower.includes("android")
    ? "android"
    : lower.includes("iphone") || lower.includes("ipad")
    ? "ios"
    : "unknown";

  return await sha256Hex(`${browser};${os}`);
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
