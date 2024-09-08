"use client"

import React from "react"

export default function Popup({ title, text, close }: { title: string, text: string | string[], close: Function }) {

    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const popupRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!containerRef.current || !popupRef.current)
                return

            const container = containerRef.current
            const popup = popupRef.current
    
            container.classList.remove("opacity-0")
            popup.classList.remove("max-h-0")
            popup.classList.add("max-h-full")

        }, 10)

        return () => {
            clearTimeout(timer)
        }
    }, [])

    function closePopup() {
        if (!containerRef.current || !popupRef.current)
            return

        const container = containerRef.current
        const popup = popupRef.current

        popup.classList.remove("max-h-full", "delay-200", "duration-[1500ms]")
        popup.classList.add("duration-500", "max-h-0")
        container.classList.add("delay-500", "opacity-0")

        setTimeout(close, 1000)
    }

    return (
        <div ref={containerRef} className="z-50 fixed inset-0 flex justify-center items-start px-3 py-[10%] bg-black/50 duration-200 opacity-0">
            <div ref={popupRef} className="flex flex-col bg-white dark:bg-neutral-700 rounded overflow-hidden max-h-0 delay-200 duration-[1500ms]">
                <div className="py-1 px-3 bg-sky-700 text-lg font-bold text-white">
                    <h3>{title}</h3>
                </div>
                <div className="p-5">
                    { typeof(text) === "string" ? <p>text</p> : text.map((line, i) => <p key={i}>{line}</p>) }
                </div>
                <div className="py-1 px-3 flex justify-end items-center border-t">
                    <button onClick={() => closePopup()} className="p-1 border rounded text-sm duration-200 hover:bg-black/10 dark:hover:bg-white/10">Close</button>
                </div>
            </div>
        </div>
    )
}