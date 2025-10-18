"use client";

import Logo from "@/src/components/Logo";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="py-7 mx-auto w-full max-w-sm flex flex-col justify-center gap-7 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-8xl font-bold">500</h1>
        <h2 className="text-3xl">An unexpected error occured</h2>
      </div>

      <div className="">
        <Link
          href="/login"
          className="px-3 py-1.5 bg-sky-700 text-white cursor-pointer duration-200 rounded-sm hover:opacity-75"
        >
          Login page
        </Link>
        <Logo />
      </div>
    </div>
  );
}
