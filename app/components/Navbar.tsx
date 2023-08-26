"use client"

import secureLocalStorage from "react-secure-storage"
import React from "react"
import { useRouter } from "next/navigation"

const Navbar = () => {

    const containerRef = React.useRef<HTMLDivElement|null>(null)
    const menuIconRef = React.useRef<HTMLImageElement|null>(null)
    const navBtnRef = React.useRef<HTMLDivElement|null>(null)
    const router = useRouter()

    React.useEffect(() => {
        const menuIcon = menuIconRef.current
        const navBtn = navBtnRef.current
        function closeMenu() {
            navBtn?.classList.add("scale-y-0")
            menuIcon?.classList.remove("rotate-90")
        }

        window.addEventListener("click", closeMenu)

        return () => {
            window.addEventListener("click", closeMenu)
        }
    }, [])

    function logout() {
        secureLocalStorage.removeItem("object")
        router.push('/login')
    }

    const showMenu = (e: React.MouseEvent) => {
        e.stopPropagation()

        const navBtn = navBtnRef.current
        const menuIcon = e.currentTarget
        
        navBtn?.classList.toggle('scale-y-0')
        menuIcon.classList.toggle("rotate-90")
    }

    return (
        <div className="border-b-2 border-sky-800">
            <div ref={containerRef} className="p-1 h-full container flex justify-between items-center mx-auto">
                <div className="bg-chats bg-bottom bg-contain bg-origin-content bg-clip-text text-transparent">
                    <h1 className="text-5xl font-extrabold tracking-widest text-sky-800/10">CATCAM</h1>
                </div>
                <menu className="h-full relative">
                    <img ref={menuIconRef} className="w-auto h-full duration-200 md:hidden" src="menu-icon.png" alt="hamberger menu icon" onClick={(e: React.MouseEvent) => showMenu(e)}></img>
                    <div ref={navBtnRef} className="flex flex-col gap-4 justify-end items-center rounded absolute top-14 right-0 bg-slate-300 p-2 scale-y-0 duration-200 origin-top md:bg-inherit md:static md:p-0 md:flex-row md:scale-y-100">
                        <button className="py-2 w-32 bg-sky-800 text-sky-50 rounded" onClick={() => router.push('/')}>Live</button>
                        <button className="py-2 w-32 bg-sky-800 text-sky-50 rounded" onClick={() => router.push('/recordings')}>Recordings</button>
                        <button className="py-2 w-32 bg-sky-800 text-orange-500" onClick={() => logout()}>Logout</button>
                    </div>
                </menu>
            </div>
        </div>
    )
}

export default Navbar
