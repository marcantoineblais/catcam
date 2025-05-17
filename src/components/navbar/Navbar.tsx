"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../Logo";
import NavbarButton from "./NavbarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import renderPopup from "@/src/utils/renderPopup";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const noNavbarPaths = ["/login"];
  const currentPage = usePathname();
  const router = useRouter();

  // Close the menu when clicking anywhere on screen
  React.useEffect(() => {
    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("click", closeMenu);

    return () => {
      window.addEventListener("click", closeMenu);
    };
  }, []);

  function toggleMenu(e: React.MouseEvent) {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  }

  async function logout() {
    const response = await fetch("/logout");

    if (response.ok) {
      router.push("/login");
    } else {
      renderPopup([
        "Could not disconnect you at the moment.",
        "Please retry later.",
      ]);
    }
  }

  if (noNavbarPaths.includes(currentPage)) return null;

  return (
    <div className="pt-1 shadow dark:shadow-zinc-50/10 landscape:hidden lg:landscape:block">
      <div className="px-3 h-12 container max-w-screen-lg flex justify-between items-center mx-auto">
        <div className="h-full flex items-center text-gray-950 dark:text-zinc-100">
          <Logo />
          <h1 className="-m-3 pt-3.5 text-xl italic self-start underline">
            Catcam
          </h1>
        </div>

        <menu className="h-full py-1 relative flex justify-end items-end md:py-0">
          <div
            className="py-1 h-full flex items-center duration-200 md:hidden"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon
              data-active={isMenuOpen ? true : undefined}
              className="cursor-pointer duration-500 ease-in-out data-[active]:rotate-90"
              icon={faBars}
              size="2x"
            />
          </div>
          <div
            className="w-full flex flex-col justify-end items-end fixed top-12 right-0 z-50 bg-gray-50 dark:bg-zinc-900 translate-x-full duration-500 origin-right 
                md:w-full md:bg-inherit md:static md:p-0 md:flex-row md:translate-x-0
                data-[active]:translate-x-0 ease-in-out"
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
            <NavbarButton label="Logout" warning={true} action={logout} />
          </div>
        </menu>
      </div>
    </div>
  );
};

export default Navbar;
