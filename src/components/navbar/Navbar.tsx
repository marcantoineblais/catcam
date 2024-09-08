"use client";

import React, { MouseEventHandler, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../Logo";
import { deleteCookie } from "cookies-next";
import NavbarButton from "./NavbarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const menuIconRef = React.useRef<HTMLDivElement | null>(null);
    const navBtnRef = React.useRef<HTMLDivElement | null>(null);
    const currentPage = usePathname();
    const router = useRouter();

    // Close the menu when clicking anywhere on screen
    React.useEffect(() => {
        const menuIcon = menuIconRef.current;
        const navBtn = navBtnRef.current;

        if (!menuIcon || !navBtn)
            return;

        const closeMenu = () => {
            navBtn.classList.add("scale-x-0");
            menuIcon.classList.remove("rotate-90");
        };

        window.addEventListener("click", closeMenu);

        return () => {
            window.addEventListener("click", closeMenu);
        };
    }, []);

    // logout and clean storage
    function logout() {
        deleteCookie("session");
        router.push("/login");
    }

    // Open menu
    const showMenu = (e: React.MouseEvent) => {
        e.stopPropagation();

        const navBtn = navBtnRef.current;
        const menuIcon = e.currentTarget;

        navBtn?.classList.toggle('scale-x-0');
        menuIcon.classList.toggle("rotate-90");
    };

    return (
        <div className="pt-1 border-b-2 border-gray-300 shadow dark:border-zinc-700 dark:shadow-zinc-50/10">
            <div ref={containerRef} className="px-3 h-12 container max-w-screen-lg flex justify-between items-center mx-auto">
                <div className="h-full flex items-center text-gray-950 dark:text-zinc-100">
                    <Logo />
                    <h1 className="-m-3 pt-3.5 text-xl italic self-start underline">Catcam</h1>
                </div>
                <menu className="h-full py-1 relative flex justify-end items-end lg:py-0">
                    <div ref={menuIconRef} className="py-1 h-full flex items-center duration-200 lg:hidden" onClick={(e: React.MouseEvent) => showMenu(e)}>
                        <FontAwesomeIcon className="w-8 h-8" icon={faBars} />
                    </div>
                    <div ref={navBtnRef} className="w-screen flex flex-col justify-end items-end fixed top-12 right-0 z-50 bg-gray-50 dark:bg-zinc-900 scale-x-0 duration-200 origin-right lg:w-full lg:bg-inherit lg:static lg:p-0 lg:flex-row lg:scale-x-100">
                        <NavbarButton label="Live" url={"/live"} active={currentPage === "/live"} />
                        <NavbarButton label="Recordings" url={"/recordings"} active={currentPage === "/recordings"} />
                        <NavbarButton label="Settings" url={"/settings"} active={currentPage === "/settings"} />
                        <NavbarButton label="Logout" url={"/logout"} warning={true} />
                    </div>
                </menu>
            </div>
        </div>
    );
};

export default Navbar;
