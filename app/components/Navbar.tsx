"use client"

import React from "react"
import { useRouter } from "next/navigation"

const Navbar = ({ activePage }: { activePage: string }) => {

    const containerRef = React.useRef<HTMLDivElement|null>(null)
    const menuIconRef = React.useRef<HTMLImageElement|null>(null)
    const navBtnRef = React.useRef<HTMLDivElement|null>(null)
    const router = useRouter()

    React.useEffect(() => {
        const menuIcon = menuIconRef.current
        const navBtn = navBtnRef.current
        
        function closeMenu() {
            navBtn?.classList.add("scale-y-0")
            menuIcon?.classList.remove("-rotate-90")
        }

        window.addEventListener("click", closeMenu)

        return () => {
            window.addEventListener("click", closeMenu)
        }
    }, [])

    React.useEffect(() => {
        const navBtn = navBtnRef.current
        if (!navBtn)
            return

        if (activePage === "live") {
            navBtn.children[0].classList.add("border-b-sky-700", "cursor-default", "text-gray-500")
            navBtn.children[0].classList.remove("hover:border-b-gray-500", "hover:text-gray-500")
        } else if (activePage === "recording") {
            navBtn.children[1].classList.add("border-b-sky-700", "cursor-default", "text-gray-500")
            navBtn.children[1].classList.remove("hover:border-b-gray-500", "hover:text-gray-500")
        }
    }, [activePage])

    function logout() {
        localStorage.clear()
        sessionStorage.clear()
        router.push('/login')
    }

    const showMenu = (e: React.MouseEvent) => {
        e.stopPropagation()

        const navBtn = navBtnRef.current
        const menuIcon = e.currentTarget
        
        navBtn?.classList.toggle('scale-y-0')
        menuIcon.classList.toggle("-rotate-90")
    }

    return (
        <div className="border-b-2 border-gray-700 shadow-md">
            <div ref={containerRef} className="px-1 h-full container flex justify-between items-center mx-auto">
                <div className="bg-chats bg-bottom bg-contain bg-origin-content bg-clip-text text-transparent">
                    <h1 className="text-5xl font-extrabold tracking-widest text-gray-700/10">CATCAM</h1>
                </div>
                <menu className="h-full relative flex justify-end items-end">
                    <img ref={menuIconRef} className="w-9 h-full duration-200 object-contain md:hidden" src="Menu.svg" alt="menu icon" onClick={(e: React.MouseEvent) => showMenu(e)}></img>
                    <div ref={navBtnRef} className="flex flex-col justify-end items-end rounded absolute top-12 right-0 z-50 bg-gray-50 scale-y-0 duration-200 origin-top md:bg-inherit md:static md:p-0 md:flex-row md:scale-y-100">
                        <button className="w-32 text-center py-3 border-b-4 duration-200 border-gray-300 hover:text-gray-500 hover:border-gray-500 md:py-1" onClick={() => router.push('/')}>Live</button>
                        <button className="w-32 text-center py-3 border-b-4 duration-200 border-gray-300 hover:text-gray-500 hover:border-gray-500 md:py-1" onClick={() => router.push('/recordings')}>Recordings</button>
                        <button className="w-32 text-center py-3 border-b-4 border-gray-300 text-orange-700 duration-200 hover:text-orange-500 hover:border-orange-500 md:py-1" onClick={() => logout()}>Logout</button>
                    </div>
                </menu>
            </div>
        </div>
    )
}

export default Navbar
