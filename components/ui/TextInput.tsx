import { useId, useMemo } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label?: string;
  onChange?: (value: string) => void;
} & Omit<React.ComponentProps<"input">, "onChange">;

export default function TextInput({ className, label, onChange, ...props }: Props) {
  const genId = useId();
  const inputId = useMemo(() => props.id || genId, [props.id, genId]);

  return (
    <label className="flex w-full flex-col gap-0.5" htmlFor={inputId}>
      {label && (
        <span className="text-sm font-medium text-surface-foreground">
          {label}
        </span>
      )}

      <div
        className={twMerge(
          "relative overflow-hidden rounded-lg",
          "bg-surface-card border border-surface-foreground/30 shadow-sm",
          "transition-[border-color,box-shadow] duration-200",
          "focus-within:border-surface-foreground/50",
          "focus-within:ring-2 focus-within:ring-surface-foreground/15",
          "shadow-effect dark:light-effect",
        )}
      >
        <input
          id={inputId}
          onChange={(e) => onChange?.(e.target.value)}
          className={twMerge(
            "relative z-10 w-full bg-transparent px-3 py-2",
            "text-surface-foreground outline-none",
            "placeholder:text-surface-foreground/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </div>
    </label>
  );
}
