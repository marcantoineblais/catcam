"use client"

import secureLocalStorage from "react-secure-storage"
import React from "react"
import { useRouter } from "next/navigation"

const Navbar = ({  }) => {

    const containerRef = React.useRef<HTMLDivElement|null>(null)
    const navBtnRef = React.useRef<HTMLDivElement|null>(null)
    const hamburgerRef = React.useRef<HTMLDivElement|null>(null)
    const router = useRouter()

    function logout() {
        secureLocalStorage.removeItem("object")
        router.push('/login')
    }

    const showMenu = (e: React.MouseEvent) => {
        if (!hamburgerRef.current || !navBtnRef.current)
            return

        const navBtn = navBtnRef.current
        const hamburger = hamburgerRef.current
        
        if (e.currentTarget === e.target && !hamburger.classList.contains("active"))
            e.stopPropagation()
        
        navBtn.classList.remove('hidden')
        hamburger.classList.add("active")
    }

    return (
        <div className="border-b-2 border-sky-800 bg-chats">
            <div ref={containerRef} className="p-1 h-full container flex justify-between items-center mx-auto">
                <div className="bg-chats">
                    <h1 className="text-3xl tracking-widest">CATCAM</h1>
                </div>
                <div ref={hamburgerRef}>
                    <div className="w-3 h-3 bg-menu-icon hidden" onClick={(e: React.MouseEvent) => showMenu(e)}></div>
                    <div ref={navBtnRef} className="flex gap-4 justify-end items-center">
                        <button className="py-2 w-32 bg-sky-800 text-sky-50 rounded" onClick={() => router.push('/')}>Live</button>
                        <button className="py-2 w-32 bg-sky-800 text-sky-50 rounded" onClick={() => router.push('/recordings')}>Recordings</button>
                        <button className="py-2 w-32 bg-sky-800 text-sky-50 rounded" onClick={() => logout()}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
