"use client";

export default function Loader({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "cc-spinner-sm"
      : size === "lg"
        ? "cc-spinner-lg"
        : "cc-spinner-md";

  return (
    <div
      className={`${className} cc-spinner ${sizeClass}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(25,25)">
          <g className="cc-seg cc-seg-1">
            <circle
              r="18"
              cx="0"
              cy="0"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="#ef4444"
              strokeDasharray="85 113"
              strokeDashoffset="0"
            />
          </g>
          <g className="cc-seg cc-seg-2">
            <circle
              r="18"
              cx="0"
              cy="0"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="#f59e0b"
              strokeDasharray="85 113"
              strokeDashoffset="-20"
            />
          </g>
          <g className="cc-seg cc-seg-3">
            <circle
              r="18"
              cx="0"
              cy="0"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="#10b981"
              strokeDasharray="85 113"
              strokeDashoffset="-40"
            />
          </g>
          <g className="cc-seg cc-seg-4">
            <circle
              r="18"
              cx="0"
              cy="0"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="#3b82f6"
              strokeDasharray="85 113"
              strokeDashoffset="-60"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
