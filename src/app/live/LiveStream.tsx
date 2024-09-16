"use client";

import React from "react";
import Navbar from "../../components/navbar/Navbar";
import VideoPlayer from "../../components/video/VideoPlayer";
import SourceSelector from "../../components/SourceSelector";
import renderPopup from "@/src/utils/renderPopup";
import { Monitor } from "@/src/models/monitor";

export default function LiveStream({ monitors, defaultMonitor, defaultQuality }: { monitors?: Monitor[], defaultMonitor: string, defaultQuality: string; }) {

    const [selectedMonitor, setSelectedMonitor] = React.useState<Monitor>();
    const [videoSource, setVideoSource] = React.useState<string>();
    const [isHQ, setIsHQ] = React.useState<boolean>(defaultQuality === "HQ");
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!monitors) {
            renderPopup(["Could not load video monitors.", "Please retry later."]);
            return;
        }
        if (monitors.length === 0)
            renderPopup("There is not any available video monitors at the moment.", "Warning");
    }, [monitors]);

    React.useEffect(() => {
        if (!monitors)
            return;

        const monitor = monitors.find(monitor => monitor.mid === defaultMonitor) || monitors[0];
        setSelectedMonitor(monitor);

    }, [monitors, defaultMonitor]);

    React.useEffect(() => {
        const apiUrl = process.env.API_URL;
        const path = selectedMonitor?.streams[selectedMonitor.streams.length > 1 && !isHQ ? 1 : 0];           

        if (!apiUrl || !path)
            return;

        setVideoSource(apiUrl + path);
        
    }, [selectedMonitor, isHQ]);

    return (
        <div className="flex flex-col h-full">
            <Navbar />

            <main ref={containerRef} className="relative grow p-1 container mx-auto max-w-screen-lg overflow-hidden flex flex-col">
                <VideoPlayer videoSource={videoSource} containerRef={containerRef} isLiveStream />

                <div className="pt-3 flex flex-col">
                    <h2 className="pl-3 border-b-4 border-sky-700 text-gray-700 cursor-default text-xl text-left duration-200 dark:text-zinc-300">
                        {selectedMonitor?.name || ""}
                    </h2>

                    <SourceSelector monitors={monitors} selectedMonitor={selectedMonitor} setSelectedMonitor={setSelectedMonitor} />
                </div>

                { selectedMonitor && selectedMonitor.streams.length > 1 &&
                    <div onClick={() => setIsHQ(!isHQ)} className="absolute top-3.5 right-2 flex justify-center items-center w-12 h-8 border rounded-md bg-white/25 dark:bg-black/25 cursor-pointer">
                        {isHQ ? "HQ": "SQ"}
                    </div>
                }
            </main>
        </div>
    );
}