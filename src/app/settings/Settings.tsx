"use client";

import React, { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../components/Logo";
import { setCookie } from "cookies-next";
import { Monitor } from "@/src/models/monitor";
import renderPopup from "@/src/utils/renderPopup";
import Navbar from "@/src/components/navbar/Navbar";
import FormSelect from "./FormSelect";

export default function Settings({ currentSettings, monitors }: { currentSettings: any, monitors: Monitor[]; }) {
    
    const [mode, setMode] = React.useState<string>(currentSettings.mode);
    const [nbItems, setNbItems] = React.useState<string>(currentSettings.nbItems);
    const [home, setHome] = React.useState<string>(currentSettings.home);
    const [camera, setCamera] = React.useState<string>(currentSettings.camera);
    const [quality, setQuality] = React.useState<string>(currentSettings.quality);
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
            
            <main className="h-full p-1 container mx-auto max-w-screen-lg overflow-hidden">
                <form ref={formRef} className="grow w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10 overflow-auto">
                    <h1 className="w-full pb-10 text-center text-3xl">Settings</h1>
                    
                    <FormSelect 
                        label="Appearance" 
                        name="mode" 
                        value={mode} 
                        onChange={(e) => saveSetting(e, setMode)} 
                        options={[
                            { value: "light", label: "Light" }, 
                            { value: "dark", label: "Dark" }, 
                            { value: "auto", label: "Auto" }
                        ]} 
                    />

                    <FormSelect 
                        label="Videos per page" 
                        name="nbItems" 
                        value={nbItems} 
                        onChange={(e) => saveSetting(e, setNbItems)} 
                        options={[
                            { value: "12", label: "12" }, 
                            { value: "24", label: "24" }, 
                            { value: "48", label: "48" }, 
                            { value: "96", label: "96" }
                        ]} 
                    />

                    <FormSelect 
                        label="Home page" 
                        name="home" 
                        value={home} 
                        onChange={(e) => saveSetting(e, setHome)} 
                        options={[{ value: "live", label: "Livestream" }, { value: "recordings", label: "Recordings" }]} 
                    />

                    <FormSelect 
                        label="Default camera" 
                        name="camera" 
                        value={camera} 
                        onChange={(e) => saveSetting(e, setCamera)} 
                        options={monitors.map((monitor) => { return { label: monitor.name, value: monitor.mid }})} 
                    />

                    <FormSelect 
                        label="Default quality" 
                        name="quality" 
                        value={quality} 
                        onChange={(e) => saveSetting(e, setQuality)} 
                        options={[{ label: "High", value: "HQ"}, { label: "Low", value: "SQ"}]} 
                    />
                </form>
            </main>

            <Logo className="text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150 landscape:hidden lg:landscape:block" />
        </div>
    );
}