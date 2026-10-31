import { AUTO_DARK_MODE_TIME } from "@/app/config";

import SplashScreen from "./SplashScreen";

const SPLASH_ID = "cc-splash";

// Runs before the first paint. Shows the splash once per session when the
// installed app launches (or on any page opened with ?splash), in the
// user's theme. On iOS it lines the logo up with the launch image, which
// covers the status bar the page starts below.
function showSplash(id: string, mode: string, start: number, end: number) {
  const splash = document.getElementById(id);
  if (!splash) return;

  const isInstalled =
    matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;
  const isForced = new URLSearchParams(location.search).has("splash");
  let isSeen = false;
  try {
    isSeen = sessionStorage.getItem(id) !== null;
    sessionStorage.setItem(id, "1");
  } catch {}
  if (!isForced && (!isInstalled || isSeen)) return;

  const hour = new Date().getHours();
  const isDark =
    mode === "dark" || (mode === "auto" && (hour < end || hour >= start));
  splash.setAttribute("data-theme", isDark ? "dark" : "light");

  if ((navigator as any).standalone === true) {
    const screenHeight =
      innerWidth > innerHeight
        ? Math.min(screen.width, screen.height)
        : Math.max(screen.width, screen.height);
    splash.style.setProperty(
      "--cc-splash-shift",
      `${(innerHeight - screenHeight) / 2}px`,
    );
  }

  splash.setAttribute("data-active", "");

  // Never hide the app for good if it fails to start
  setTimeout(() => (splash.style.visibility = "hidden"), 8000);
}

export default function Splash({ mode }: { mode: string }) {
  const args = JSON.stringify([
    SPLASH_ID,
    mode,
    AUTO_DARK_MODE_TIME.start,
    AUTO_DARK_MODE_TIME.end,
  ]).replace(/</g, "\\u003c");

  return (
    <>
      <SplashScreen id={SPLASH_ID} />
      <script
        dangerouslySetInnerHTML={{
          __html: `(${showSplash.toString()})(...${args})`,
        }}
      />
    </>
  );
}
