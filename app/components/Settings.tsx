"use client"

import { useRouter } from "next/navigation"
import React from "react"

export default function Settings() {

    const appearanceRef = React.useRef<HTMLSelectElement|null>(null)
    const nbItemsRef = React.useRef<HTMLSelectElement|null>(null)
    const landingRef = React.useRef<HTMLSelectElement|null>(null)
    const router = useRouter()

    React.useEffect(() => {
        const appearance = appearanceRef.current
        const appearanceValue = localStorage.getItem("appearance")
        const nbItems = nbItemsRef.current
        const nbItemsValue = localStorage.getItem("pageSize")
        const landing = landingRef.current
        const landingValue = localStorage.getItem("landing")

        if (appearance && appearanceValue)
            appearance.value = appearanceValue

        if (nbItems && nbItemsValue)
            nbItems.value = nbItemsValue

        if (landing && landingValue)
            landing.value = landingValue
    }, [appearanceRef, nbItemsRef, landingRef])

    function saveSetting(e: React.ChangeEvent) {
        const target: any = e.currentTarget

        localStorage.setItem(target.name, target.value)
        router.refresh()
    }

    function saveSettings() {
        router.back()
    }

    return (
        <div className="h-full px-1 pt-16 max-w-screen-md container mx-auto bg-[url('../public/logo.png')] bg-contain bg-no-repeat bg-bottom">
            <form  className="w-full p-5 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10">
                <h1 className="w-full pb-10 text-center text-3xl">Settings</h1>

                <label className="flex pt-3">
                    <p className="basis-48 text-sm">Appearance</p>
                    <select ref={appearanceRef} onChange={(e) => saveSetting(e)} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="appearance">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Automatique</option>
                    </select>
                </label>

                <label className="flex pt-3">
                    <p className="basis-48 text-sm">Number of items per page</p>
                    <select ref={nbItemsRef} onChange={(e) => saveSetting(e)} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="pageSize">
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                            <option value="96">96</option>
                    </select>
                </label>

                <label className="flex pt-3">
                    <p className="basis-48 text-sm">Landing page</p>
                    <select ref={landingRef} onChange={(e) => saveSetting(e)} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="landing">
                        <option value="/">Livestream</option>
                        <option value="/recordings">Recorginds</option>
                    </select>
                </label>

                <div className="pt-5 flex justify-center">
                    <button onClick={() => saveSettings()} className="py-2 w-32 bg-sky-800 text-gray-50 rounded duration-200 hover:bg-sky-700" form="login" type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}