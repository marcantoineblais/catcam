"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";

import { useSession } from "@/hooks/useSession";

import Logo from "../Logo";
import Modal from "../modal/Modal";
import { useModal } from "../modal/useModal";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import NavbarButton from "./NavbarButton";

export default function Navbar() {
  const { signOut } = useSession();
  const modal = useModal();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const noNavbarPaths = ["/login"];
  const currentPage = usePathname();
  const router = useRouter();

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
    <>
      <div className="z-40 sticky top-0 w-full bg-surface-card shadow">
        <div className="relative px-4 h-14 w-full max-w-4xl flex justify-between items-center mx-auto bg-inherit">
          <div className="-my-1 h-full flex items-center bg-inherit">
            <Logo />
            <h1 className="-m-3 pt-3.5 text-xl italic self-start underline">
              Catcam
            </h1>
          </div>

          <menu className="h-full py-1 flex justify-end items-end">
            <div className="py-1 h-full flex items-center" onClick={toggleMenu}>
              <IconButton ariaLabel="Open navigation" icon={faBars} size="2x" />
            </div>
            <div className="pointer-events-none absolute top-full left-0 right-0 overflow-hidden">
              <div
                className={twJoin(
                  "px-4 py-2 flex flex-col gap-2 justify-end items-end bg-surface-card shadow pointer-events-none",
                  "-translate-y-full transition-transform duration-500 data-active:translate-y-0 data-active:pointer-events-auto",
                )}
                data-active={isMenuOpen ? true : undefined}
              >
                <NavbarButton
                  label="Live"
                  onClick={() => router.push("/live")}
                  active={currentPage === "/live"}
                />
                <NavbarButton
                  label="Recordings"
                  onClick={() => router.push("/recordings")}
                  active={currentPage === "/recordings"}
                />
                <NavbarButton
                  label="Settings"
                  onClick={() => router.push("/settings")}
                  active={currentPage === "/settings"}
                />
                <NavbarButton
                  label="Logout"
                  warning={true}
                  onClick={modal.onOpen}
                />
              </div>
            </div>
          </menu>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        header="Logging out"
        footer={
          <>
            <Button onClick={() => modal.onClose()}>Cancel</Button>
            <Button onClick={signOut} color="warning">
              Logout
            </Button>
          </>
        }
      >
        Are you sure you want to log out? This will end your session and you
        will need to log in again to access the application.
      </Modal>
    </>
  );
}
