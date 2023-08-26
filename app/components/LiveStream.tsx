"use client"

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import VideoPlayer from "./VideoPlayer";
import secureLocalStorage from "react-secure-storage";
import requestJSON from "../util/requestJSON"

export default function LiveStream() {
    
const router = useRouter()

    const [user, setUser] = React.useState<any>(null)
    const [videoSource, setVideoSource] = React.useState<string|null>(null)
    const videoRef = React.useRef<HTMLVideoElement|null>(null)

    React.useEffect(() => {
        async function getUser() {
            const res: Response = await fetch("https://api.ipify.org?format=json")
            const data: {ip: string} = await res.json()
            const ip: string = data.ip
            const userData: any = secureLocalStorage.getItem("object")
            
            if (!userData) {
                router.push("/login")
                return
            }
            
            if (userData.exp < Date.now() || ip !== userData.ipAddress) {
                secureLocalStorage.clear()
                router.push("/login")
                
            } else {
                setUser(userData.user)
            }        
        }

        getUser()
    }, [])

    React.useEffect(() => {
        if (!user)
            return
        
        async function getLiveStream() {
            const baseURL = 'https://catcam.source.marchome.xyz'
            const ext = 's.m3u8'
            const key = user.auth_token
            const groupKey = user.ke
            const monitors = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))
            let videoFeed = monitors[0].mid
            while (!videoFeed) {
                videoFeed = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))
            }
            setVideoSource([baseURL, key, "hls", groupKey, videoFeed, ext].join("/"))
        }

        getLiveStream()
        
    }, [user])
    
    return ( 
        <>
            <Navbar />
            <div className="container mx-auto">
                <VideoPlayer videoSource={videoSource} videoRef={videoRef} />
            </div>
        </>
    )
}