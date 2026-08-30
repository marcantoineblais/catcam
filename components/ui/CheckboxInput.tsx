import { useId } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label?: React.ReactNode;
  onChange?: (value: boolean) => void;
} & Omit<React.ComponentProps<"input">, "type" | "onChange">;

export default function CheckboxInput({
  label,
  className,
  id,
  onChange,
  ...props
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="group flex w-fit cursor-pointer items-center gap-2"
      >
        <input
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          onChange={(e) => onChange?.(e.target.checked)}
          {...props}
        />

        <span
          className={twMerge(
            "relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-md",
            "border border-surface-card-foreground/30 bg-surface-card shadow-sm",
            "transition-all duration-200",
            "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2",
            "before:bg-linear-to-b before:from-shine/30 before:to-transparent",
            "group-has-checked:border-surface-foreground/60",
            "group-has-focus-visible:ring-2 group-has-focus-visible:ring-surface-foreground/30",
            className,
          )}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="
              relative z-10 size-3.5
              scale-50 rotate-[-15deg] opacity-0
              transition-all duration-200 ease-out
              group-has-checked:scale-100
              group-has-checked:rotate-0
              group-has-checked:opacity-100
            "
          >
            <path
              d="M3 8.5 6.25 12 13 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-surface-foreground"
            />
          </svg>
        </span>

        {label && (
          <span className="select-none text-sm text-surface-foreground">
            {label}
          </span>
        )}
      </label>
    </div>
  );
}