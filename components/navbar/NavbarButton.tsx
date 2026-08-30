"use client";

import { useMemo } from "react";

import Button from "../ui/Button";

export default function NavbarButton({
  label,
  active,
  warning,
  onClick,
}: {
  label: string;
  active?: boolean;
  warning?: boolean;
  onClick?: () => void;
}) {
  const color = useMemo(() => {
    if (active) return "primary";
    if (warning) return "warning";
    return "default";
  }, [active, warning]);

  return (
    <Button onClick={onClick} color={color} className="w-full">
      {label}
    </Button>
  );
}
