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
        return "bg-primary text-primary-foreground shine-effect";
      case "secondary":
        return "bg-secondary text-secondary-foreground shine-effect";
      case "warning":
        return "bg-warning text-warning-foreground shine-effect";
      case "danger":
        return "bg-danger text-danger-foreground shine-effect";
      default:
        return "bg-surface-card text-surface-card-foreground shadow-shadow dark:shine-effect";
    }
  }, [color]);

  return (
    <button
      type={type}
      className={twMerge(
        colorClasses,
        "relative overflow-hidden py-2 w-32 rounded-soft font-medium cursor-pointer",
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
