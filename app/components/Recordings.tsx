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

    // API request to get the recordings
    // If successful, create video object to be rendered
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

    // Make sure that the good action triggers when manipulation the recordings list
    // Cannot refresh page from menu if the menu is not scrolled up
    // menu will open before scrolling
    // menu will close only when scroll up (and disable refresh during this time)
    const manageTouchMove = (e: React.TouchEvent) => {
        e.stopPropagation()
        const recordingsList = recordingsListRef.current

        if (!recordingsList)
            return

        const start = e.touches[0].clientY
        const recordingsListScroll = recordingsList.scrollTop
        const notRecordingsList = e.currentTarget !== recordingsList
        let disableRefresh = recordingsListScroll > 0
        let disableAction = false
        
        const stopScroll = (e: TouchEvent) => {
            const position = e.touches[0].clientY

            if (recordingsList.scrollTop > 0)
                disableRefresh = true
            
            if (disableRefresh)
                e.stopPropagation()
            
            if (!disableAction && start - position > 0 && notRecordingsList) {                
                if (unfoldRecordingsList()) {
                    disableRefresh = true
                    disableAction = true
                }
            } else if (!disableAction && (recordingsListScroll <= 0 || notRecordingsList) && start - position <= 0) {
                if (foldRecordingsList())  {
                    disableRefresh = true
                    disableAction = true
                }
            }  
        }
               
        const removeListeners = () => {
            window.removeEventListener("touchmove", stopScroll)
            window.removeEventListener("touchend", removeListeners)
        }

        window.addEventListener("touchmove", stopScroll)
        window.addEventListener("touchend", removeListeners)
    }

    // Open and close the recordings folding menu
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

        if (!unfoldable || !unfoldBtn || !unfoldable.style.top)
            return false

        unfoldable.style.top = ""
        unfoldable.style.minHeight = ""
        unfoldBtn.classList.remove("rotate-180")
        
        return true
    }

    // Switch between recordings and zoom pad
    function toggleSection(section: string) {
        const recordingsBtn = recordingsBtnRef.current
        const zoomBtn = zoomBtnRef.current
        const hscroll = hscrollRef.current

        if (!recordingsBtn || !zoomBtn || !hscroll)
            return
        
        if (section === "recordings") {
            recordingsBtn.classList.add("border-sky-700", "text-gray-700", "cursor-default", "dark:text-zinc-300")
            recordingsBtn.classList.remove("border-gray-400", "hover:border-gray-700", "dark:border-zinc-800", "dark:hover:border-zinc-300")
            zoomBtn.classList.remove("border-sky-700", "text-gray-700", "cursor-default", "dark:text-zinc-300")
            zoomBtn.classList.add("border-gray-400", "hover:border-gray-700", "dark:border-zinc-800", "dark:hover:border-zinc-300")
            hscroll.classList.remove("-translate-x-1/2")
        } else if (section === "zoom") {
            zoomBtn.classList.add("border-sky-700", "text-gray-700", "cursor-default", "dark:text-zinc-300")
            zoomBtn.classList.remove("border-gray-400", "hover:border-gray-700", "dark:border-zinc-800", "dark:hover:border-zinc-300")
            recordingsBtn.classList.remove("border-sky-700", "text-gray-700", "cursor-default", "dark:text-zinc-300")
            recordingsBtn.classList.add("border-gray-400", "hover:border-gray-700", "dark:border-zinc-800", "dark:hover:border-zinc-300")
            hscroll.classList.add("-translate-x-1/2")
        }
    }
    
    return (
        <>
            <Navbar activePage="recordings" />
            <div ref={containerRef} className="p-1 h-full container mx-auto max-w-screen-lg flex flex-col flex-grow overflow-hidden">
                <VideoPlayer videoSource={videoSource} videoRef={videoRef} containerRef={containerRef} isLiveStream={false} />
                <div className="relative h-full">
                    <div
                        ref={unfoldableRef}
                        onTouchStart={(e) => manageTouchMove(e)}
                        className="absolute top-0 bottom-0 left-0 right-0 min-h-0 flex flex-col overflow-hidden transition-height duration-500 bg-gray-100 dark:bg-zinc-900"
                    >
                        <div className="w-full mt-3 mb-1 flex justify-between items-center shadow dark:shadow-zinc-50/10">
                            <button onClick={() => toggleSection("recordings")} ref={recordingsBtnRef} className="pl-3 basis-5/12 border-b-4 border-sky-700 text-gray-700 cursor-default text-xl text-left duration-200 dark:text-zinc-300">Recordings</button>
                            <div className="w-8 flex justify-center items-center">
                                <div ref={unfoldBtnRef} onClick={() => toggleRecordingsList()} className="h-full w-12 duration-500 cursor-pointer">
                                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                                        <rect fill="currentColor" x="26.01" y="198.84" width="252" height="39.88" rx="4.17" transform="translate(-89.02 105.31) rotate(-30)"/>
                                        <rect fill="currentColor" x="221.99" y="198.84" width="252" height="39.88" rx="4.17" transform="translate(539.97 582.25) rotate(-150)"/>
                                        <rect fill="currentColor" x="62.29" y="269.95" width="214.14" height="39.88" rx="4.17" transform="matrix(0.87, -0.5, 0.5, 0.87, -122.26, 123.52)"/>
                                        <rect fill="currentColor" x="225.37" y="270.35" width="215.72" height="39.88" rx="4.17" transform="translate(476.68 708.31) rotate(-150)"/>
                                    </svg>
                                </div>
                            </div>
                            <button onClick={() => toggleSection("zoom")} ref={zoomBtnRef} className="pr-3 basis-5/12 text-xl text-right border-gray-400 hover:text-gray-700 hover:border-gray-700 border-b-4 dark:border-zinc-800 dark:hover:border-zinc-300 dark:hover:text-zinc-300">Zoom</button>
                        </div>
                        <div className="w-full flex-grow overflow-hidden">
                            <div ref={hscrollRef} className="w-[200%] h-full duration-500 flex justify-between overflow-hidden">
                                <div className="h-full basis-1/2">
                                    <RecordingList
                                        recordings={recordings}
                                        setVideoSource={setVideoSource}
                                        containerRef={containerRef}
                                        recordingsListRef={recordingsListRef}
                                        manageTouchMove={manageTouchMove}
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