"use client";

import { usePathname } from "next/navigation";

import Logo from "./Logo";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/recordings") return null;

  return (
    <footer aria-hidden="true">
      <Logo className="-z-10 pointer-events-none fixed inset-x-0 bottom-0 text-text opacity-[0.045] dark:opacity-[0.06] translate-y-1/2 scale-125" />
    </footer>
  );
}
