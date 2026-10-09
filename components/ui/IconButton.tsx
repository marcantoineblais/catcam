"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes, ComponentProps, useMemo } from "react";
import { twMerge } from "tailwind-merge";

type IconButtonColor =
  | "default"
  | "danger"
  | "primary"
  | "secondary"
  | "warning";
type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "type" | "role" | "onClick" | "className" | "disabled"
>;

type IconButtonProps = {
  icon: IconDefinition;
  title?: string;
  color?: IconButtonColor;
  ariaLabel: string;
  size?: ComponentProps<typeof FontAwesomeIcon>["size"];
  isDisabled?: boolean;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  role?: ButtonHTMLAttributes<HTMLButtonElement>["role"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
} & NativeButtonProps;

export default function IconButton({
  icon,
  title,
  ariaLabel,
  className,
  color = "default",
  size = "1x",
  type = "button",
  role,
  isDisabled = false,
  onClick,
  ...props
}: IconButtonProps) {
  const hoverClasses: Record<IconButtonColor, string> = useMemo(
    () => ({
      default: "hover:bg-text/6",
      danger: "hover:bg-danger/10 hover:text-danger",
      primary: "hover:bg-primary/10 hover:text-primary",
      secondary: "hover:bg-secondary/10",
      warning: "hover:bg-warning",
    }),
    [],
  );

  return (
    <button
      type={type}
      role={role}
      title={title ?? ariaLabel}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={onClick}
      className={twMerge(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-text",
        "cursor-pointer transition-[background-color,color,transform] duration-200 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent",
        hoverClasses[color],
        className,
      )}
      {...props}
    >
      <FontAwesomeIcon icon={icon} size={size} />
    </button>
  );
}
