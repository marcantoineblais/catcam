import { useCallback, useEffect, useRef, useState } from "react";

const DOUBLE_TAP_DELAY = 250; // ms between taps to count as a double tap
const CHAIN_WINDOW = 700; // ms during which extra taps keep seeking
const SEEK_STEP = 10; // seconds

export type SeekSide = "left" | "right";

export type SeekFeedback = {
  side: SeekSide;
  amount: number;
  id: number;
};

type Options = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  seek: (time: number) => void;
  onSingleTap: () => void;
};

/**
 * Double tap the left/right side of the video to seek -10s / +10s.
 * Keep tapping the same side to chain more seeks (YouTube style).
 * A single tap falls through to `onSingleTap` (toggle the overlay).
 */
export default function useDoubleTapSeek({
  videoRef,
  seek,
  onSingleTap,
}: Options) {
  const [feedback, setFeedback] = useState<SeekFeedback | null>(null);

  const lastTapRef = useRef<{ side: SeekSide; time: number } | null>(null);
  const chainRef = useRef<{ side: SeekSide; until: number } | null>(null);
  const singleTapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSingleTap = useCallback(() => {
    if (!singleTapTimeout.current) return;
    clearTimeout(singleTapTimeout.current);
    singleTapTimeout.current = null;
  }, []);

  const seekBy = useCallback(
    (side: SeekSide) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration)) return;

      const delta = side === "left" ? -SEEK_STEP : SEEK_STEP;
      seek(video.currentTime + delta);

      chainRef.current = { side, until: performance.now() + CHAIN_WINDOW };
      setFeedback((prev) => ({
        side,
        amount:
          prev && prev.side === side ? prev.amount + SEEK_STEP : SEEK_STEP,
        id: Date.now(),
      }));

      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
      feedbackTimeout.current = setTimeout(() => {
        setFeedback(null);
        feedbackTimeout.current = null;
      }, CHAIN_WINDOW);
    },
    [seek, videoRef],
  );

  const handleTap = useCallback(
    (side: SeekSide) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      const now = performance.now();

      const chain = chainRef.current;
      const isChaining =
        chain !== null && chain.side === side && now < chain.until;

      const lastTap = lastTapRef.current;
      const isDoubleTap =
        lastTap !== null &&
        lastTap.side === side &&
        now - lastTap.time < DOUBLE_TAP_DELAY;

      if (isChaining || isDoubleTap) {
        clearSingleTap();
        lastTapRef.current = null;
        seekBy(side);
        return;
      }

      clearSingleTap();
      lastTapRef.current = { side, time: now };
      singleTapTimeout.current = setTimeout(() => {
        lastTapRef.current = null;
        singleTapTimeout.current = null;
        onSingleTap();
      }, DOUBLE_TAP_DELAY);
    },
    [clearSingleTap, onSingleTap, seekBy],
  );

  useEffect(() => {
    return () => {
      clearSingleTap();
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    };
  }, [clearSingleTap]);

  return { feedback, handleTap };
}
