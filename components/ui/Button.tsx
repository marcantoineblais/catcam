import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "default" | "warning" | "danger";
} & React.ComponentProps<"button">;

export default function Button({
  children,
  className,
  color = "default",
  type = "button",
  ...props
}: Props) {
  const colorClasses = useMemo(() => {
    switch (color) {
      case "primary":
        return "bg-primary text-primary-foreground shadow-glow hover:bg-primary-hover disabled:hover:bg-primary";
      case "secondary":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/90 dark:ring-1 dark:ring-border";
      case "warning":
        return "bg-warning text-warning-foreground hover:brightness-[0.97] dark:hover:brightness-125";
      case "danger":
        return "bg-danger text-danger-foreground hover:brightness-110";
      default:
        return "bg-surface-card text-surface-card-foreground ring-1 ring-border shadow-shadow hover:bg-text/4";
    }
  }, [color]);

  return (
    <button
      type={type}
      className={twMerge(
        "relative inline-flex h-10 min-w-32 items-center justify-center gap-2 px-4",
        "rounded-soft text-sm font-semibold tracking-tight whitespace-nowrap",
        "cursor-pointer transition-[background-color,box-shadow,transform,filter] duration-200 ease-out",
        "active:scale-[0.97]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-default disabled:active:scale-100",
        colorClasses,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
