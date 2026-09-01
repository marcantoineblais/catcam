import { useMemo } from "react";
import { twJoin, twMerge } from "tailwind-merge";

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
        return "bg-primary text-primary-foreground shine-effect";
      case "secondary":
        return "bg-secondary text-secondary-foreground shine-effect";
      case "warning":
        return "bg-warning text-warning-foreground shine-effect";
      case "danger":
        return "bg-danger text-danger-foreground shine-effect";
      default:
        return "bg-surface-card ring ring-surface-card-foreground/30 text-surface-card-foreground shadow-effect dark:shine-effect";
    }
  }, [color]);

  return (
    <button
      type={type}
      className={twMerge(
        colorClasses,
        "relative overflow-hidden py-2 w-32 rounded-lg font-medium cursor-pointer shadow-sm",
        "hover:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
