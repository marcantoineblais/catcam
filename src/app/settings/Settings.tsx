"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Logo from "../../components/Logo";
import { setCookie } from "cookies-next";
import { Monitor } from "@/src/models/monitor";

export default function Settings({ currentSettings, monitors }: { currentSettings: any, monitors: Monitor[]; }) {

    const [mode, setMode] = React.useState<string>(currentSettings.mode);
    const [nbItems, setNbItems] = React.useState<string>(currentSettings.nbItems);
    const [home, setHome] = React.useState<string>(currentSettings.home);
    const [camera, setCamera] = React.useState<string>(currentSettings.camera);
    const formRef = React.useRef<HTMLFormElement>(null);
    const router = useRouter();


    function saveSetting() {
        const form = formRef.current;

        if (!form)
            return;

        const expDate = new Date(8640000000000000)
        const options = { path: "/", expires: expDate }

        setMode(form.mode.value);
        setNbItems(form.nbItems.value);
        setHome(form.home.value);
        setCamera(form.camera.value);

        setCookie("mode", form.mode.value, options);
        setCookie("nbItems", form.nbItems.value, options);
        setCookie("home", form.home.value, options);
        setCookie("camera", form.camera.value, options);
        router.refresh();
    }

    return (
        <div className="h-full px-1 pt-5 max-w-screen-md container mx-auto flex flex-col justify-between items-center">
            <form ref={formRef} className="w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10">
                <h1 className="w-full pb-10 text-center text-3xl paysage-hidden">Settings</h1>

                <label className="flex pt-3">
                    <p className="basis-36 text-sm">Appearance</p>
                    <select value={mode} onChange={saveSetting} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="mode">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                    </select>
                </label>

                <label className="flex pt-3">
                    <p className="basis-36 text-sm">Recordings per page</p>
                    <select value={nbItems} onChange={saveSetting} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="nbItems">
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                        <option value="96">96</option>
                    </select>
                </label>

                <label className="flex pt-3">
                    <p className="basis-36 text-sm">Landing page</p>
                    <select value={home} onChange={saveSetting} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="home">
                        <option value="live">Livestream</option>
                        <option value="recordings">Recordings</option>
                    </select>
                </label>

                <label className="flex pt-3">
                    <p className="basis-36 text-sm">Default camera</p>
                    <select value={camera} onChange={saveSetting} className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="camera">
                        {monitors.map((monitor, i) => <option key={i} value={monitor.mid}>{`${monitor.name} (${monitor.mid})`}</option>)}
                    </select>
                </label>
            </form>

            <Logo className="text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150" />
        </div>
    );
}