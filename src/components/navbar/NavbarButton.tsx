"use client";

import Link from "next/link";
import React from "react";

export default function NavbarButton({ label, active, warning, url }: { label: string, active?: boolean, warning?: boolean, url: string }) {

    return (
        <Link 
            href={url} 
            className="w-full text-center py-4 border-2 lg:w-32 lg:py-1.5 lg:border-0 lg:border-b-4 text-gray-700 border-gray-700 duration-200 hover:brightness-200 dark:hover:brightness-50
                dark:text-zinc-300 dark:border-zinc-300 lg:bg-none dark
                data-[active]:cursor-default data-[active]:hover:brightness-100 data-[active]:bg-sky-700 data-[active]:lg:bg-inherit data-[active]:border-sky-700 data-[active]:text-inherit data-[active]:lg:text-sky-700 
                data-[active]:dark:border-sky-700 data-[active]:dark:brightness-100
                data-[warning]:border-amber-900 data-[warning]:text-amber-900 data-[warning]:dark:border-orange-400 data-[warning]:dark:text-amber-400"
            data-active={active ? true : undefined}
            data-warning={warning ? true : undefined}
        >
            {label}
        </Link>
    );
}