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
        return "bg-primary text-primary-foreground";
      case "secondary":
        return "bg-secondary text-secondary-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "danger":
        return "bg-danger text-danger-foreground";
      default:
        return "bg-surface border border-surface-foreground/30 text-surface-foreground";
    }
  }, [color]);

  return (
    <button
      type={type}
      className={twMerge(
        colorClasses,
        "relative overflow-hidden py-2 w-32 rounded-lg font-medium cursor-pointer shadow-sm",
        "before:absolute before:inset-x-0 before:top-0 before:h-1/2",
        "before:bg-linear-to-b before:from-white/30 before:to-transparent",
        "before:pointer-events-none",
        "after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3",
        "after:skew-x-[-20deg]",
        "after:bg-linear-to-r after:from-transparent after:via-white/40 after:to-transparent",
        "after:transition-[left] after:duration-500",
        "hover:after:left-[120%]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
