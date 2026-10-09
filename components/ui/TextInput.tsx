import { useId, useMemo } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label?: string;
  onChange?: (value: string) => void;
} & Omit<React.ComponentProps<"input">, "onChange">;

export default function TextInput({
  className,
  label,
  onChange,
  ...props
}: Props) {
  const genId = useId();
  const inputId = useMemo(() => props.id || genId, [props.id, genId]);

  return (
    <label className="flex w-full flex-col gap-1.5" htmlFor={inputId}>
      {label && (
        <span className="text-sm font-medium text-surface-foreground">
          {label}
        </span>
      )}

      <div
        className={twMerge(
          "relative overflow-hidden rounded-soft",
          "bg-text/3 ring-1 ring-border",
          "transition-[box-shadow,background-color] duration-200",
          "hover:ring-text/15",
          "focus-within:bg-surface-card focus-within:ring-2 focus-within:ring-primary/70",
        )}
      >
        <input
          id={inputId}
          onChange={(e) => onChange?.(e.target.value)}
          className={twMerge(
            "relative z-10 h-11 w-full bg-transparent px-3.5",
            "text-surface-foreground outline-none",
            "placeholder:text-muted",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </div>
    </label>
  );
}
