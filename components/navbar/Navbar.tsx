"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";

import Logo from "../Logo";
import IconButton from "../ui/IconButton";
import NavbarButton from "./NavbarButton";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const noNavbarPaths = ["/login"];
  const currentPage = usePathname();

  useEffect(() => {
    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  useEffect(() => {
    startTransition(() => setIsMenuOpen(false));
  }, [currentPage]);

  function toggleMenu(e: React.MouseEvent) {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  }

  if (noNavbarPaths.includes(currentPage)) return null;

  return (
    <div className="z-40 w-full bg-surface-card shadow">
      <div className="relative px-4 h-14 container max-w-4xl flex justify-between items-center mx-auto bg-inherit">
        <div className="-my-1 h-full flex items-center bg-inherit">
          <Logo />
          <h1 className="-m-3 pt-3.5 text-xl italic self-start underline">
            Catcam
          </h1>
        </div>

        <menu className="h-full py-1 flex justify-end items-end md:py-0">
          <div
            className="py-1 h-full flex items-center"
            onClick={toggleMenu}
          >
            <IconButton
              ariaLabel="Open navigation"
              icon={faBars}
              size="2x"
            />
          </div>
          <div className="absolute -z-10 inset-0 bg-surface-card">
            <div
              className={twJoin(
                "-z-10 absolute px-4 py-2 flex flex-col gap-2 justify-end items-end top-full left-0 right-0 bg-inherit",
                "-translate-y-full transition-transform duration-500 data-active:translate-y-0",
              )}
              data-active={isMenuOpen ? true : undefined}
            >
              <NavbarButton
                label="Live"
                url="/live"
                active={currentPage === "/live"}
              />
              <NavbarButton
                label="Recordings"
                url="/recordings"
                active={currentPage === "/recordings"}
              />
              <NavbarButton
                label="Settings"
                url="/settings"
                active={currentPage === "/settings"}
              />
              <NavbarButton
                label="Logout"
                warning={true}
                url="/logout"
                active={currentPage === "/logout"}
              />
            </div>
          </div>
        </menu>
      </div>
    </div>
  );
}
