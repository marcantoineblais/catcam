"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes, ComponentProps, useMemo } from "react";
import { twMerge } from "tailwind-merge";

type IconButtonColor = "default" | "danger" | "primary" | "secondary" | "warning";
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
      default: "hover:text-text/50",
      danger: "hover:text-danger/50",
      primary: "hover:text-primary/50",
      secondary: "hover:text-secondary/50",
      warning: "hover:text-warning/50",
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
        "text-text duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:text-text-muted disabled:hover:text-text-muted",
        hoverClasses[color],
        className,
      )}
      {...props}
    >
      <FontAwesomeIcon icon={icon} size={size} />
    </button>
  );
}
