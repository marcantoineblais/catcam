"use client"

import React from "react"
import Navbar from "./components/Navbar"
import VideoPlayer from "./components/VideoPlayer"
import ZoomPad from "./components/ZoomPad"
import requestJSON from "./util/requestJSON"
import Popup from "./components/Popup"

export default function LiveStream({ session, setSession }: { session: any, setSession: Function }) {

    const [videoSource, setVideoSource] = React.useState<string|null>(null)
    const [errorPopup, setErrorPopup] = React.useState<boolean>(false)
    const videoRef = React.useRef<HTMLVideoElement|null>(null)
    const containerRef = React.useRef<HTMLDivElement|null>(null)

    // API call to get the livefeed url using jwt
    React.useEffect(() => {
        if (!session || !Object.keys(session).length)
            return
        
        const requestTimer = setTimeout(() => setErrorPopup(true), 7000)
        async function getLiveStream() {
            const baseURL = process.env.serverUrl
            const ext = 's.m3u8'
            const key = session.auth_token
            const groupKey = session.ke            
            const monitors = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))

            if (!monitors)
                return

            let videoFeed = monitors[0].mid
            
            setVideoSource([baseURL, key, "hls", groupKey, videoFeed, ext].join("/"))
            clearTimeout(requestTimer)
        }

        getLiveStream()
        
    }, [session])
    
    return ( 
        <>
            <Navbar activePage="live" />
            <div ref={containerRef} className="p-1 container mx-auto max-w-screen-lg overflow-hidden flex flex-col flex-grow">
                <VideoPlayer videoSource={videoSource} videoRef={videoRef} containerRef={containerRef} isLiveStream={true} />
                <ZoomPad videoRef={videoRef} containerRef={containerRef} />
            </div>
            { errorPopup && <Popup title="Connexion expired" text={["Your connexion has expired, you will be logged out.", "Please try to login again."]} action={() => setSession({})} /> }
        </>
    )
}