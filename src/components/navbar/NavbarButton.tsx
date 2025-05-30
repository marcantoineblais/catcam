"use client";

import Link from "next/link";
import React, { MouseEventHandler } from "react";

export default function NavbarButton({
  label,
  active,
  warning,
  url = "",
  action,
}: {
  label: string;
  active?: boolean;
  warning?: boolean;
  url?: string;
  action?: MouseEventHandler;
}) {
  return (
    <Link
      href={url}
      className="w-full text-center py-4 md:w-32 md:py-1.5 inset-ring-2 md:inset-ring-0 md:shadow-none inset-ring-gray-900/10 bg-inherit dark:inset-ring-zinc-50/10 md:border-b-4 border-gray-700 duration-200 hover:brightness-75 dark:border-zinc-300 md:bg-none data-active:cursor-default data-active:hover:brightness-100 data-active:bg-sky-700 data-active:md:bg-inherit data-active:border-sky-700 data-active:text-white data-active:md:text-sky-700 data-active:dark:border-sky-700 data-active:dark:brightness-100 data-warning:border-amber-600 data-warning:text-amber-600 data-warning:dark:border-orange-400 data-warning:dark:text-amber-400"
      data-active={active ? true : undefined}
      data-warning={warning ? true : undefined}
      onClick={action}
    >
      {label}
    </Link>
  );
}
