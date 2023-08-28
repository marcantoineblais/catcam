"use client"

import React from "react"
import Navbar from "./Navbar"
import requestJSON from "../util/requestJSON"
import VideoPlayer from "./VideoPlayer"
import RecordingList from "./RecordingList"
import ZoomPad from "./ZoomPad"

export default function Recordings({ session }: { session: any }) {

    const [videoSource, setVideoSource] = React.useState<string|null>(null)
    const [recordings, setRecordings] = React.useState<any[]|null>(null)
    const videoRef = React.useRef<HTMLVideoElement|null>(null)
    const containerRef = React.useRef<HTMLDivElement|null>(null)

    React.useEffect(() => {
        if (!session || Object.entries(session).some(([_k, v]) => !v))
            return

        const baseURL = 'https://catcam.source.marchome.xyz'
        
        function createVideosObject(videos: any[], snapshots: any[], thumbnailUrl: string): any[] {
            return videos.map((v: any) => {
                const videoTime = new Date(v.time)
                let thumbnail = null

                for (let i = 1; i < snapshots.length; i++) {
                    const upperTime = new Date(snapshots[i - 1].time)
                    const lowerTime = new Date(snapshots[i].time)

                    if (videoTime >= lowerTime && videoTime <= upperTime) {
                        const filename = snapshots[i - 1].filename
                        thumbnail = filename.split("T")[0] + "/" + filename
                    }
                }

                return ({
                    videoSource: baseURL + v.href,
                    time: videoTime,
                    thumbnail: thumbnailUrl + "/" + thumbnail
                })
            }).filter((t: any) => !t.thumbnail.includes("null"))
        }

        async function getRecordings() {
            const key = session.auth_token
            const groupKey = session.ke
            const monitors = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))
            let videoFeed = monitors[0].mid
            while (!videoFeed) {
                videoFeed = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))
            }
            const thumbnailUrl = [baseURL, key, "timelapse", groupKey, videoFeed].join('/')
            const snapshots = await requestJSON(thumbnailUrl)
            let videos = await requestJSON([baseURL, key, "videos", groupKey, videoFeed].join('/'))
            while (!videos.ok) {
                videos = await requestJSON([baseURL, key, "videos", groupKey, videoFeed].join('/'))
            }
            
            setRecordings(createVideosObject(videos.videos, snapshots, thumbnailUrl))
        }

        getRecordings()
    }, [session])
    
    return (
        <>
            <Navbar />
            <div ref={containerRef} className="container mx-auto overflow-hidden flex flex-col flex-grow">
                <VideoPlayer videoSource={videoSource} videoRef={videoRef} containerRef={containerRef} isLiveStream={false} />
                <div className="w-full flex justify-between">
                    <button
                        className="recording-btn active"
                    >Recordings</button>
                    <button
                        className="recording-btn"
                    >Zoom</button>
                </div>
                <div className="h-full flex flex-col overflow-hidden">
                    <RecordingList recordings={recordings} setVideoSource={setVideoSource} containerRef={containerRef} />
                    {/* <ZoomPad containerRef={containerRef} videoRef={videoRef} /> */}
                </div>
            </div>
        </>
    )
}