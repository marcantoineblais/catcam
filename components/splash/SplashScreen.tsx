"use client";

import { useEffect, useRef, useState } from "react";

import Logo from "../Logo";

export default function SplashScreen({ id }: { id: string }) {
  const splashRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"intro" | "outro" | "done">("intro");

  // The app is hydrated: let the intro finish, then fade out
  useEffect(() => {
    const splash = splashRef.current;
    if (!splash) return;

    let cancelled = false;
    const isActive = splash.hasAttribute("data-active");
    const intro = isActive
      ? (splash.getAnimations?.({ subtree: true }) ?? [])
      : [];

    Promise.allSettled(intro.map((animation) => animation.finished)).then(
      () => {
        if (!cancelled) setPhase(isActive ? "outro" : "done");
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={splashRef}
      id={id}
      className="cc-splash"
      data-phase={phase}
      aria-hidden="true"
      // The inline script sets data-active, data-theme and style before paint
      suppressHydrationWarning
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setPhase("done");
      }}
    >
      <div className="cc-splash-stage">
        <div className="cc-splash-glow" />

        <div className="cc-splash-mark">
          <svg className="cc-splash-focus" viewBox="0 0 152 152">
            <path d="M2 24V8a6 6 0 0 1 6-6h16" />
            <path d="M128 2h16a6 6 0 0 1 6 6v16" />
            <path d="M150 128v16a6 6 0 0 1-6 6h-16" />
            <path d="M24 150H8a6 6 0 0 1-6-6v-16" />
          </svg>
          <span className="cc-splash-icon">
            <Logo className="size-[76%]" />
          </span>
        </div>

        <div className="cc-splash-text">
          <p className="cc-splash-name">Catcam</p>
          <p className="cc-splash-tagline">Keeping an eye on the cats</p>
        </div>
      </div>
    </div>
  );
}
