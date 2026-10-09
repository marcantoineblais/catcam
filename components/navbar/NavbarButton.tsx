"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";

export default function NavbarButton({
  label,
  icon,
  active,
  warning,
  className,
  onClick,
}: {
  label: string;
  icon?: IconDefinition;
  active?: boolean;
  warning?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={active}
      aria-current={active ? "page" : undefined}
      data-active={active || undefined}
      data-warning={warning || undefined}
      className={twMerge(
        "inline-flex h-9 items-center gap-2 px-4 rounded-full text-sm font-medium text-muted",
        "cursor-pointer transition-[background-color,color,box-shadow] duration-200",
        "hover:bg-text/5 hover:text-text",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "data-active:cursor-default data-active:bg-surface-card data-active:text-primary data-active:shadow-shadow dark:data-active:bg-text/10",
        "data-warning:text-danger data-warning:hover:bg-danger/10",
        className,
      )}
    >
      {icon && <FontAwesomeIcon icon={icon} className="w-4" />}
      {label}
    </button>
  );
}
