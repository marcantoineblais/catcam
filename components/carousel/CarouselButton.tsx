import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CarouselButtonProps = {
  align?: "left" | "center" | "right";
  children: ReactNode;
} & React.ComponentProps<"button">;
export default function CarouselButton({
  align = "left",
  children,
  className,
  ...props
}: CarouselButtonProps) {
  return (
    <button
      type="button"
      data-right={align === "right" || undefined}
      data-center={align === "center" || undefined}
      className={twMerge(
        "flex-1 min-w-0 h-9 px-4 inline-flex items-center justify-center gap-2 rounded-full",
        "text-sm font-medium text-muted cursor-pointer truncate",
        "transition-[background-color,color,box-shadow] duration-200",
        "hover:text-text",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-default disabled:bg-surface-card disabled:text-text disabled:shadow-shadow dark:disabled:bg-text/10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
