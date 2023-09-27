"use client"

import React from "react";
import Navbar from "./components/Navbar";
import VideoPlayer from "./components/VideoPlayer";
import requestJSON from "./util/requestJSON"
import ZoomPad from "./components/ZoomPad";

export default function LiveStream({ session }: { session: any}) {

    const [videoSource, setVideoSource] = React.useState<string|null>(null)
    const videoRef = React.useRef<HTMLVideoElement|null>(null)
    const containerRef = React.useRef<HTMLDivElement|null>(null)

    // API call to get the livefeed url using jwt
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
            <div ref={containerRef} className="p-1 container h-full mx-auto max-w-screen-lg overflow-hidden flex flex-col flex-grow">
                <VideoPlayer videoSource={videoSource} videoRef={videoRef} containerRef={containerRef} isLiveStream={true} />
                <ZoomPad videoRef={videoRef} containerRef={containerRef} />
            </div>
        </>
    )
}