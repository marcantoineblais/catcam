"use client";

import { usePathname } from "next/navigation";

import Logo from "./Logo";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/recordings") return null;

  return (
    <footer>
      <Logo className="-z-10 fixed inset-x-0 bottom-0 text-text translate-y-1/2 scale-125" />
    </footer>
  );
}
