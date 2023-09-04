"use client"

import React from "react"
import { useRouter } from "next/navigation"

const Navbar = ({ activePage }: { activePage: string }) => {

    const containerRef = React.useRef<HTMLDivElement|null>(null)
    const menuIconRef = React.useRef<HTMLDivElement|null>(null)
    const navBtnRef = React.useRef<HTMLDivElement|null>(null)
    const router = useRouter()

    // Close the menu when clicking anywhere on screen
    React.useEffect(() => {
        const menuIcon = menuIconRef.current
        const navBtn = navBtnRef.current
        
        if (!menuIcon || !navBtn)
            return

        const closeMenu = () => {
            navBtn.classList.add("scale-x-0")
            menuIcon.classList.remove("rotate-90")
        }

        window.addEventListener("click", closeMenu)

        return () => {
            window.addEventListener("click", closeMenu)
        }
    }, [])

    // Change colors of the active page btn
    React.useEffect(() => {
        const navBtn = navBtnRef.current
        
        if (!navBtn)
            return
        
        let i = 0
        
        if (activePage === "live")
            i = 0
        else if (activePage === "recordings")
            i = 1
        else if (activePage === "settings")
            i = 2

        navBtn.children[i].classList.add("bg-sky-700", "border-sky-700", "cursor-default", "text-gray-100", "lg:text-inherit", "dark:text-zinc-300")
        navBtn.children[i].classList.remove("border-gray-400","hover:text-gray-700", "hover:border-gray-700","dark:border-zinc-800", "dark:bg-zinc-700", "dark:hover:border-zinc-300")
    }, [activePage])

    // logout and clean storage
    function logout() {
        localStorage.removeItem("JWT")
        sessionStorage.removeItem("JWT")
        router.push("/login")
    }

    // Open menu
    const showMenu = (e: React.MouseEvent) => {
        e.stopPropagation()

        const navBtn = navBtnRef.current
        const menuIcon = e.currentTarget
        
        navBtn?.classList.toggle('scale-x-0')
        menuIcon.classList.toggle("rotate-90")
    }

    return (
        <div className="border-b-2 border-gray-300 shadow dark:border-zinc-700 dark:shadow-zinc-50/10">
            <div ref={containerRef} className="px-1 h-full container max-w-screen-lg flex justify-between items-center mx-auto">
                <div className="bg-chats bg-bottom bg-contain bg-origin-content bg-clip-text text-transparent">
                    <h1 className="text-5xl font-extrabold tracking-widest text-gray-950/50 dark:text-zinc-100/50">CATCAM</h1>
                </div>
                <menu className="h-full relative flex justify-end items-end">
                    <div ref={menuIconRef} className="w-9 h-full flex items-center duration-200 lg:hidden" onClick={(e: React.MouseEvent) => showMenu(e)}>
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                            <rect fill="currentColor" x="212" y="-121.02" width="76" height="463.89" rx="4.12" transform="translate(360.92 -139.08) rotate(90)" />
                            <rect fill="currentColor" x="212" y="157.13" width="76" height="463.89" rx="4.12" transform="translate(639.08 139.08) rotate(90)" />
                            <rect fill="currentColor" x="212" y="18.05" width="76" height="463.89" rx="4.12" transform="translate(500 0) rotate(90)" />
                        </svg>
                    </div>
                    <div ref={navBtnRef} className="w-screen flex flex-col justify-end items-end fixed top-12 right-0 z-50 bg-gray-50 scale-x-0 duration-200 origin-right lg:w-full lg:bg-inherit lg:static lg:p-0 lg:flex-row lg:scale-x-100">
                        <button className="w-full text-center py-5 border-4 duration-200 border-gray-400 hover:text-gray-700 hover:border-gray-700 lg:w-32 lg:py-1 lg:border-0 lg:border-b-4 lg:bg-inherit dark:bg-zinc-700 dark:border-zinc-800 lg:dark:bg-inherit dark:hover:border-zinc-300 dark:hover:text-zinc-300" onClick={() => router.push('/')}>Live</button>
                        <button className="w-full text-center py-5 border-4 duration-200 border-gray-400 hover:text-gray-700 hover:border-gray-700 lg:w-32 lg:py-1 lg:border-0 lg:border-b-4 lg:bg-inherit dark:bg-zinc-700 dark:border-zinc-800 lg:dark:bg-inherit dark:hover:border-zinc-300 dark:hover:text-zinc-300" onClick={() => router.push('/recordings')}>Recordings</button>
                        <button className="w-full text-center py-5 border-4 duration-200 border-gray-400 hover:text-gray-700 hover:border-gray-700 lg:w-32 lg:py-1 lg:border-0 lg:border-b-4 lg:bg-inherit dark:bg-zinc-700 dark:border-zinc-800 lg:dark:bg-inherit dark:hover:border-zinc-300 dark:hover:text-zinc-300" onClick={() => router.push('/settings')}>Settings</button>
                        <button className="w-full text-center py-5 border-4 border-gray-400 text-amber-900 duration-200 hover:text-amber-700 hover:border-amber-700 lg:w-32 lg:py-1 lg:border-0 lg:border-b-4 lg:bg-inherit dark:bg-zinc-700 dark:border-gray-800 lg:dark:bg-inherit dark:text-orange-400 dark:hover:text-amber-500 dark:hover:border-orange-500" onClick={() => logout()}>Logout</button>
                    </div>
                </menu>
            </div>
        </div>
    )}

export default Navbar
