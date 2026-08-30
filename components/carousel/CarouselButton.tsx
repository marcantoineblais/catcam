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
      data-right={align === "right" || undefined}
      data-center={align === "center" || undefined}
      className={twMerge(
        "px-3 basis-5/12 border-b-2 border-text/50 text-xl text-left duration-200 cursor-pointer", 
        "hover:opacity-80", 
        "disabled:border-primary disabled:cursor-default disabled:hover:opacity-100",
        "data-right:text-right data-center:text-center",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
