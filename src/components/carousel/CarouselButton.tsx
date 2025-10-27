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
      className={twMerge("px-3 basis-5/12 border-b-4 border-gray-400 text-xl text-left duration-200 cursor-pointer dark:text-zinc-300 dark:border-zinc-300 hover:brightness-75 disabled:border-sky-700 disabled:cursor-default disabled:hover:brightness-100 disabled:hover:dark:brightness-100 data-right:text-right data-center:text-center", className)}
      {...props}
    >
      {children}
    </button>
  );
}
