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
    const recordingsBtnRef = React.useRef<HTMLButtonElement|null>(null)
    const zoomBtnRef = React.useRef<HTMLButtonElement|null>(null)
    const hscrollRef = React.useRef<HTMLDivElement|null>(null)
    const zoomContainerRef = React.useRef<HTMLDivElement|null>(null)
    const unfoldBtnRef = React.useRef<HTMLImageElement|null>(null)
    const unfoldableRef = React.useRef<HTMLDivElement|null>(null)
    const recordingsListRef = React.useRef<HTMLDivElement|null>(null)

    React.useEffect(() => {
        if (!session)
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

    function toggleRecordingsList() {
        const unfoldBtn = unfoldBtnRef.current

        if (!unfoldBtn)
            return

        if (unfoldBtn.classList.contains("rotate-180")) 
            foldRecordingsList()
        else 
            unfoldRecordingsList()
    }

    function unfoldRecordingsList(): boolean {
        const unfoldable = unfoldableRef.current
        const unfoldBtn = unfoldBtnRef.current
        const recordingsList = recordingsListRef.current
        const container = containerRef.current

        if (!unfoldable || !unfoldBtn || !recordingsList || !container || unfoldable.style.top)
            return false

        let translation 
        if (recordingsList.scrollHeight > container.clientHeight - 100)
            translation = container.clientHeight - 100 - recordingsList.clientHeight
        else
            translation = recordingsList.scrollHeight - recordingsList.clientHeight
        
        unfoldable.style.top = `${-translation}px`
        unfoldable.style.minHeight = `${unfoldable.clientHeight + translation}px`
        unfoldBtn.classList.add("rotate-180")

        return true
    }

    function foldRecordingsList(): boolean {
        const unfoldable = unfoldableRef.current
        const unfoldBtn = unfoldBtnRef.current
        const recordingsList = recordingsListRef.current
        const container = containerRef.current

        if (!unfoldable || !unfoldBtn || !recordingsList || !container || !unfoldable.style.top)
            return false

        let translation 
        if (recordingsList.scrollHeight > container.clientHeight - 100)
            translation = container.clientHeight - 100 - recordingsList.clientHeight
        else
            translation = recordingsList.scrollHeight - recordingsList.clientHeight

        unfoldable.style.top = ""
        unfoldable.style.minHeight = ""
        unfoldBtn.classList.remove("rotate-180")

        return true
    }

    function toggleSection(section: string) {
        const recordingsBtn = recordingsBtnRef.current
        const zoomBtn = zoomBtnRef.current
        const hscroll = hscrollRef.current

        if (!recordingsBtn || !zoomBtn || !hscroll)
            return
        
        if (section === "recordings") {
            recordingsBtn.classList.add("border-sky-700", "text-gray-500", "cursor-default")
            recordingsBtn.classList.remove("hover:border-gray-500", "hover:text-gray-500", "border-gray-700")
            zoomBtn.classList.remove("border-sky-700", "text-gray-500", "cursor-default")
            zoomBtn.classList.add("hover:border-gray-500", "hover:text-gray-500", "border-gray-700")
            hscroll.classList.remove("-translate-x-1/2")
        } else if (section === "zoom") {
            foldRecordingsList()
            zoomBtn.classList.add("border-sky-700", "text-gray-500", "cursor-default")
            zoomBtn.classList.remove("hover:border-gray-500", "hover:text-gray-500", "border-gray-700")
            recordingsBtn.classList.remove("border-sky-700", "text-gray-500", "cursor-default")
            recordingsBtn.classList.add("hover:border-gray-500", "hover:text-gray-500", "border-gray-700")
            hscroll.classList.add("-translate-x-1/2")
        }
        window.dispatchEvent(new Event('resize'))
    }
    
    return (
        <>
            <Navbar activePage="recording" />
            <div ref={containerRef} className="p-1 h-full container mx-auto flex flex-col flex-grow overflow-hidden">
                <VideoPlayer videoSource={videoSource} videoRef={videoRef} containerRef={containerRef} isLiveStream={false} />
                <div className="relative h-full">
                    <div ref={unfoldableRef} className="absolute top-0 bottom-0 left-0 right-0 min-h-0 flex flex-col overflow-hidden transition-height duration-500 bg-gray-100">
                        <div className="w-full mt-3 mb-1 flex justify-between items-center shadow-lg">
                            <button onClick={() => toggleSection("recordings")} ref={recordingsBtnRef} className="pl-3 basis-5/12 border-b-4 border-sky-700 text-gray-500 cursor-default text-xl text-left duration-200">Recordings</button>
                            <div className="w-8 flex justify-center items-center border-gray-300 border-double">
                                <img ref={unfoldBtnRef} onClick={() => toggleRecordingsList()} src="Unfold.svg" alt="upward arrow" className="h-full object-contain duration-500 cursor-pointer"/>
                            </div>
                            <button onClick={() => toggleSection("zoom")} ref={zoomBtnRef} className="pr-3 basis-5/12 border-gray-700 border-b-4 text-xl text-right duration-200 hover:border-gray-500 hover:text-gray-500">Zoom</button>
                        </div>
                        <div className="w-full flex-grow overflow-hidden">
                            <div ref={hscrollRef} className="w-[200%] h-full duration-500 flex justify-between overflow-hidden">
                                <div className="h-full basis-1/2">
                                    <RecordingList
                                        recordings={recordings}
                                        setVideoSource={setVideoSource}
                                        containerRef={containerRef}
                                        recordingsListRef={recordingsListRef}
                                        unfoldRecordingsList={unfoldRecordingsList}
                                        foldRecordingsList={foldRecordingsList}
                                    />
                                </div>
                                <div ref={zoomContainerRef} className="h-full basis-1/2 flex overflow-hidden">
                                    <ZoomPad containerRef={zoomContainerRef} videoRef={videoRef} />
                                </div>
                            </div>
                        </div>        
                    </div>
                </div>
            </div>
        </>
    )
}