"use client";

import {
  faArrowRightFromBracket,
  faBars,
  faFilm,
  faGear,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
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

const NAV_LINKS = [
  { label: "Live", href: "/live", icon: faVideo },
  { label: "Recordings", href: "/recordings", icon: faFilm },
  { label: "Settings", href: "/settings", icon: faGear },
];

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
      <header className="z-40 sticky top-0 w-full glass border-b border-border">
        <div className="relative px-3 md:px-4 h-16 w-full max-w-4xl flex justify-between items-center gap-4 mx-auto">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow transition-transform duration-300 group-hover:-rotate-6">
              <Logo className="size-7" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Catcam</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-text/4 ring-1 ring-border">
            {NAV_LINKS.map((link) => (
              <NavbarButton
                key={link.href}
                label={link.label}
                icon={link.icon}
                onClick={() => router.push(link.href)}
                active={currentPage === link.href}
              />
            ))}
          </nav>

          <div className="hidden md:block">
            <IconButton
              ariaLabel="Logout"
              icon={faArrowRightFromBracket}
              color="danger"
              onClick={modal.onOpen}
            />
          </div>

          {/* Mobile navigation */}
          <menu className="md:hidden flex items-center">
            <div onClick={toggleMenu}>
              <IconButton
                ariaLabel={isMenuOpen ? "Close navigation" : "Open navigation"}
                icon={isMenuOpen ? faXmark : faBars}
                size="lg"
                aria-expanded={isMenuOpen}
              />
            </div>

            <div className="pointer-events-none absolute top-full inset-x-0 px-3 pt-2">
              <div
                className={twJoin(
                  "card p-2 flex flex-col gap-1 shadow-elevated origin-top",
                  // Closing: plain quick fade, no movement
                  "pointer-events-none opacity-0 transition-opacity duration-150 ease-out",
                  // Opening: small drop-in (keyframe only runs when it opens)
                  "data-active:pointer-events-auto data-active:opacity-100 data-active:animate-pop",
                )}
                data-active={isMenuOpen ? true : undefined}
              >
                {NAV_LINKS.map((link) => (
                  <NavbarButton
                    key={link.href}
                    label={link.label}
                    icon={link.icon}
                    onClick={() => router.push(link.href)}
                    active={currentPage === link.href}
                    className="w-full h-11 rounded-xl text-base data-active:bg-primary/10 dark:data-active:bg-primary/15 data-active:shadow-none"
                  />
                ))}

                <div className="my-1 h-px bg-border" />

                <NavbarButton
                  label="Logout"
                  icon={faArrowRightFromBracket}
                  warning={true}
                  onClick={modal.onOpen}
                  className="w-full h-11 rounded-xl text-base"
                />
              </div>
            </div>
          </menu>
        </div>
      </header>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        header="Logging out"
        footer={
          <>
            <Button onClick={() => modal.onClose()}>Cancel</Button>
            <Button onClick={signOut} color="danger">
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
