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
        className="group flex w-fit cursor-pointer items-center gap-2.5"
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
            "relative flex size-5 shrink-0 items-center justify-center rounded-md",
            "bg-text/3 ring-1 ring-text/20",
            "transition-[background-color,box-shadow] duration-200",
            "group-hover:ring-text/35",
            "group-has-checked:bg-primary group-has-checked:ring-primary group-has-checked:shadow-glow",
            "group-has-focus-visible:outline-2 group-has-focus-visible:outline-offset-2 group-has-focus-visible:outline-primary",
            className,
          )}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="
              relative z-10 size-3.5 text-primary-foreground
              scale-50 opacity-0
              transition-all duration-200 ease-out
              group-has-checked:scale-100
              group-has-checked:opacity-100
            "
          >
            <path
              d="M3 8.5 6.25 12 13 4.5"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
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
