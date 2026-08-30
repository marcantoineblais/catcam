"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import Button from "../ui/Button";

export default function NavbarButton({
  label,
  active,
  warning,
  url = "",
}: {
  label: string;
  active?: boolean;
  warning?: boolean;
  url?: string;
}) {
  const router = useRouter();
  const color = useMemo(() => {
    if (active) return "primary";
    if (warning) return "warning";
    return "default";
  }, [active, warning]);

  function handleClick() {
    if (url) router.push(url);
  }

  return (
    <Button onClick={handleClick} color={color}  className="w-full">
      {label}
    </Button>
  );
}