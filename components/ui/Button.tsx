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
        return "bg-primary text-primary-foreground reflect-bright";
      case "secondary":
        return "bg-secondary text-secondary-foreground reflect-shine";
      case "warning":
        return "bg-warning text-warning-foreground reflect-dark";
      case "danger":
        return "bg-danger text-danger-foreground reflect-shine";
      default:
        return "bg-surface-card text-surface-card-foreground reflect-fade dark:reflect-light";
    }
  }, [color]);

  return (
    <button
      type={type}
      className={twMerge(
        colorClasses,
        "relative overflow-hidden py-2 w-32 rounded-soft font-medium cursor-pointer reflect",
        "ring shadow-shadow ring-surface-card-foreground/10",
        "hover:shadow-none duration-500 transition-shadow ease-in-out",
        "disabled:cursor-default disabled:shadow-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
