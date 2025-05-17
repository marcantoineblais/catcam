import { MouseEventHandler } from "react";

export default function CarouselButton({
  label = "",
  align = "left",
  isActive = false,
  onClick,
}: {
  label?: string;
  isActive?: boolean;
  align: "left" | "center" | "right";
  onClick?: MouseEventHandler;
}) {
  return (
    <button
      onClick={onClick}
      data-right={align === "right" ? true : undefined}
      data-center={align === "center" ? true : undefined}
      data-active={isActive ? true : undefined}
      className="px-3 basis-5/12 border-b-4 border-gray-400 text-xl text-left duration-200 cursor-pointer dark:text-zinc-300 dark:border-zinc-300 hover:brightness-75 data-active:border-sky-700 data-active:cursor-default data-active:hover:brightness-100 data-active:hover:dark:brightness-100 data-right:text-right data-center:text-center"
    >
      {label}
    </button>
  );
}
