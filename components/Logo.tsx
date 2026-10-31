import { twMerge } from "tailwind-merge";

import { LOGO_PATHS, LOGO_SIZE } from "@/libs/logo";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge("max-h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${LOGO_SIZE} ${LOGO_SIZE}`}
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
    </svg>
  );
}
