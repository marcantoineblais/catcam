"use client";

import React, { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../components/Logo";
import { setCookie } from "cookies-next";
import { Monitor } from "@/src/models/monitor";
import renderPopup from "@/src/utils/renderPopup";
import Navbar from "@/src/components/navbar/Navbar";

export default function Settings({ currentSettings, monitors }: { currentSettings: any, monitors: Monitor[]; }) {

    const [mode, setMode] = React.useState<string>(currentSettings.mode);
    const [nbItems, setNbItems] = React.useState<string>(currentSettings.nbItems);
    const [home, setHome] = React.useState<string>(currentSettings.home);
    const [camera, setCamera] = React.useState<string>(currentSettings.camera);
    const formRef = React.useRef<HTMLFormElement>(null);
    const router = useRouter();


    async function saveSetting(e: React.ChangeEvent<HTMLSelectElement>, setValue: Function) {
        const value = e.currentTarget.value
        const name = e.currentTarget.name
        const body = { name, value }

        try {
            const response = await fetch("/settings/save", {
                method: "POST",
                body: JSON.stringify(body)
            })

            if (response.ok) {
                setValue(value);
                router.refresh();
            } else {
                renderPopup(["Could not update your settings.", "Please try again later."])
            }
        } catch(ex) {
            renderPopup(["Could not update your settings.", "Please try again later."])
        }
    }

    return (     
        <div className="flex flex-col h-full overflow-hidden">
            <Navbar />
            
            <main className="grow p-1 container mx-auto max-w-screen-lg overflow-hidden">
                <form ref={formRef} className="grow w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10">
                    <h1 className="w-full pb-10 text-center text-3xl paysage-hidden">Settings</h1>

                    <label className="flex pt-3">
                        <p className="basis-36 text-sm">Appearance</p>
                        <select value={mode} onChange={(e) => saveSetting(e, setMode)} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="mode">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>

                    <label className="flex pt-3">
                        <p className="basis-36 text-sm">Recordings per page</p>
                        <select value={nbItems} onChange={(e) => saveSetting(e, setNbItems)} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="nbItems">
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                            <option value="96">96</option>
                        </select>
                    </label>

                    <label className="flex pt-3">
                        <p className="basis-36 text-sm">Landing page</p>
                        <select value={home} onChange={(e) => saveSetting(e, setHome)} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="home">
                            <option value="live">Livestream</option>
                            <option value="recordings">Recordings</option>
                        </select>
                    </label>

                    <label className="flex pt-3">
                        <p className="basis-36 text-sm">Default camera</p>
                        <select value={camera} onChange={(e) => saveSetting(e, setCamera)} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="camera">
                            {monitors.map((monitor, i) => <option key={i} value={monitor.mid}>{`${monitor.name} (${monitor.mid})`}</option>)}
                        </select>
                    </label>
                </form>
            </main>

            <Logo className="text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150" />
        </div>
    );
}