"use client"

import React from "react";
import Navbar from "./Navbar";
import VideoPlayer from "./VideoPlayer";
import requestJSON from "../util/requestJSON"
import ZoomPad from "./ZoomPad";

export default function LiveStream({ session }: { session: any}) {

    const [videoSource, setVideoSource] = React.useState<string|null>(null)
    const videoRef = React.useRef<HTMLVideoElement|null>(null)
    const containerRef = React.useRef<HTMLDivElement|null>(null)

    React.useEffect(() => {
        if (!session || Object.entries(session).some(([_k, v]) => !v))
            return
        
        async function getLiveStream() {
            const baseURL = 'https://catcam.source.marchome.xyz'
            const ext = 's.m3u8'
            const key = session.auth_token
            const groupKey = session.ke
            const monitors = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))
            let videoFeed = monitors[0].mid
            while (!videoFeed) {
                videoFeed = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))
            }
            setVideoSource([baseURL, key, "hls", groupKey, videoFeed, ext].join("/"))
        }

        getLiveStream()
        
    }, [session])
    
    return ( 
        <>
            <Navbar activePage="live" />
            <div ref={containerRef} className="container mx-auto flex flex-col flex-grow justify-center items-center pb-5">
                <VideoPlayer videoSource={videoSource} videoRef={videoRef} containerRef={containerRef} isLiveStream={true} />
                <ZoomPad videoRef={videoRef} containerRef={containerRef} />
            </div>
        </>
    )
}