"use client";

import Logo from "@/src/components/Logo";
import Link from "next/link";
import React from "react";

export default function NotFound() {

  return (
    <div className="flex flex-col gap-3">
      <h1>404 - This page does not exist</h1>
      <Link href="/">Landing page</Link>
      <Logo />
    </div>
  );
}
