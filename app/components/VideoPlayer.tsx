import React from "react"
import Hls from "hls.js"
import { useRouter } from "next/navigation"

export default function VideoPlayer({ videoSource, videoRef }: { videoSource: string|null, videoRef: React.MutableRefObject<HTMLVideoElement|null> }) {

    const [videoTime, setVideoTime] = React.useState<string>("")
    const [videoEnd, setVideoEnd] = React.useState<string>("")
    const [duration, setDuration] = React.useState<number>(0)
    const [overlayTimeouts] = React.useState<any[]>([])
    const [dblClicksTimeouts] = React.useState<any[]>([])
    const videoContainerRef = React.useRef<HTMLDivElement|null>(null)
    const overlayRef = React.useRef<HTMLDivElement|null>(null)
    const playBtnRef = React.useRef<HTMLDivElement|null>(null)
    const videoSeekingRef = React.useRef<HTMLDivElement|null>(null)
    const progressBarRef = React.useRef<HTMLDivElement|null>(null)
    const bufferBarRef = React.useRef<HTMLDivElement|null>(null)
    const router = useRouter()


    React.useEffect(() => {
        const video = videoRef.current
        const progress = progressBarRef.current

        if (!video || !videoSource || !progress)
            return

        progress.style.left = ""
        progress.style.right = ""
        
        if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(videoSource)
            hls.attachMedia(video)
            
        } else 
            video.src = videoSource
    }, [videoSource, videoRef])


    // Resize streaming or recording video element when resizing window
    React.useEffect(() => {
        const container = videoContainerRef.current
        if (!container)
            return

        const resize = () => {
            container.style.height = (container.clientWidth / 16) * 9 + "px"
        }

        container.style.height = (container.clientWidth / 16) * 9 + "px"
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [videoContainerRef])


    const setFullScreen = () => {
        const video = videoRef.current
        if (!video)
            return

        if (video.requestFullscreen)
            video.requestFullscreen()
    }

    const playPauseVideo = async (e: React.MouseEvent) => {
        const video = videoRef.current
        const overlay = overlayRef.current
        const playBtn = playBtnRef.current

        if (!video || !overlay || !playBtn)
            return
        
        if (video.ended)
            video.currentTime = 0

        if (video.paused) {
            try {
                await video.play()
            } catch (ex) {
                router.refresh()
            }
        } else if (!video.paused) {
            try {
                video.pause()
            } catch (ex) {
                router.refresh()
            }
        }

        for (let i: number = 0; i < playBtn.children.length; i++){
            playBtn.children[i].classList.toggle("opacity-0")
        }
    }

    const getTimeString = (time: number) => {
        let seconds = Math.floor(time % 60).toString()
        const minutes = Math.floor(time / 60).toString()

        if (seconds.length === 1)
            seconds = "0" + seconds

        return minutes + ":" + seconds
    }

    const updateDuration = () => {
        const video = videoRef.current
        if (!video)
            return

        const time = video.duration

        setDuration(time)
        setVideoEnd(getTimeString(time))
    }

    const updateProgressBar = () => {
        const video = videoRef.current
        const progress = progressBarRef.current
        
        if (duration <= 0 || !video || !progress)
            return

        const time = video.currentTime

        progress.style.width = (time / duration) * 100 + "%"
        setVideoTime(getTimeString(time))
    }

    const updateBufferBar = () => {
        const video = videoRef.current
        const buffer = bufferBarRef.current
        
        if (!video || !buffer)
        return
    
        const buffers = video.buffered

        if (!buffers.length)
            return

        const end = buffers.end(buffers.length - 1)
        const videoDuration = video.duration || end

        let position = 100 - ((end / videoDuration) * 100)

        if (position > 100)
            position = 100
        else if (position < 0)
            position = 0

        buffer.style.left = "0"
        buffer.style.right = position + "%"
        setDuration(videoDuration)
        setVideoEnd(getTimeString(videoDuration))
    }

    const toggleOverlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        const overlay = overlayRef.current

        if (!overlay)
            return

        if (overlay.classList.contains("video-overlay-visible"))
            hideOverlay(e)
        else
            showOverlay(e)
    }

    const hideOverlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        const overlay = overlayRef.current

        if (!overlay)
            return

        overlay.classList.add("invisible")
    }

    const showOverlay = (e: React.MouseEvent) => {
        e.stopPropagation()

        const overlay = overlayRef.current
        let n: number = 0;

        if (!overlay)
            return

        overlayTimeouts.forEach(t => {
            clearTimeout(t)
            n ++
        })
        overlayTimeouts.splice(0, n)
        overlay.classList.remove("opacity-0")

        overlayTimeouts.push(setTimeout(() => {
            overlay.classList.add("opacity-0")
        }, 2000))
    }

    // const videoSeeking = async (e) => {
    //     const video = videoRef.current
    //     const seekBar = videoSeekingRef.current

    //     if (!video || !seekBar)
    //         return

    //     const paused = video.paused
    //     const progress = progressBarRef.current
    //     const start = seekBar.getBoundingClientRect().left
    //     const end = seekBar.getBoundingClientRect().right

    //     if (video.seeking)
    //         return

    //     if (!paused) {
    //         try {
    //             await video.pause()
    //         } catch (ex) {
    //             router.refresh()
    //         }
    //     }

    //     const seek = (e: React.MouseEvent|React.TouchEvent) => {
    //         const position = e.clientX || e.touches[0].clientX

    //         if (position >= start && position <= end) {
    //             const progressFraction = 1 - ((end - position) / (end - start))
    //             progress.style.width = progressFraction * 100 + "%"
    //             video.currentTime = progressFraction * duration
    //         }
    //     }

    //     const clear = () => {
    //         window.removeEventListener("mouseup", clear)
    //         window.removeEventListener("mousemove", seek)
    //         seekBar.removeEventListener("touchend", clear)
    //         seekBar.removeEventListener("touchmove", seek)
    //         if (!paused) {
    //             playPauseVideo()
    //         }
    //     }

    //     window.addEventListener("mouseup", clear)
    //     window.addEventListener("mousemove", seek)
    //     seekBar.addEventListener("touchend", clear)
    //     seekBar.addEventListener("touchmove", seek)
    //     seek(e)
    // }

    // const seekOnDblClick = (e, value) => {
    //     e.stopPropagation()

    //     const target = e.currentTarget
    //     const removeTimeouts = () => {
    //         let n
    //         dblClicksTimeouts.forEach(t => {
    //             clearTimeout(t)
    //             n++
    //         })
    //         dblClicksTimeouts.splice(0, n)
    //     }
    //     const seek = (e) => {
    //         e.stopPropagation()
    //         removeTimeouts()
    //         showOverlay(e)
    //         target.removeEventListener("click", seek)
    //         const video = videoRef.current
    //         const time = video.currentTime

    //         if (value > 0 && value + time <= duration)
    //             video.currentTime = time + value
    //         else if (value < 0 && value + time >= 0)
    //             video.currentTime = time + value
    //     }

    //     if (dblClicksTimeouts.length === 0)
    //         toggleOverlay(e)

    //     target.addEventListener("click", seek)
    //     overlayTimeouts.push(setTimeout(() => {
    //         removeTimeouts()
    //         target.removeEventListener("click", seek)
    //     }, 300))
    // }

    const onVideoEnd = () => {
        // playPause.current.classList.remove("pause")
        overlayRef.current?.classList.remove("opacity-0")
    }

    return (
        <div className="pt-3 flex justify-center">
            <div ref={videoContainerRef} className="w-full h-full relative">
                <video
                    className="w-full h-full object-fill"
                    ref={videoRef}
                    onTimeUpdate={() => updateProgressBar()}
                    onProgress={() => updateBufferBar()}
                    onLoadedMetadata={() => updateDuration()}
                    onPause={() => overlayRef.current?.classList.remove("opacity-0")}
                    onEnded={() => onVideoEnd()}
                    autoPlay
                    muted
                    playsInline
                    controlsList="noremoteplayback nufullscreen nodownload"
                    poster=""
                >
                    Your browser does not support HTML5 video.
                </video>
                
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 opacity-0 duration-200"
                    ref={overlayRef}
                    // onMouseMove={(e) => showOverlay(e)}
                    onClick={(e) => toggleOverlay(e)}
                    onMouseMove={(e) => showOverlay(e)}
                >
                    <div ref={playBtnRef} className="absolute top-1/3 left-1/2 w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-neutral-950/75 cursor-pointer -translate-x-1/2" onClick={(e) => playPauseVideo(e)}>
                        <img className="absolute p-4 lg:p-6 top-0 left-0 right-0 bottom-0 object-contain duration-200" src="Pause.svg" />
                        <img className="absolute p-4 lg:p-6 top-0 left-0 right-0 bottom-0 object-contain duration-200 opacity-0" src="Play.svg" />
                    </div>

                    <div className="px-5 absolute h-8 bottom-0 w-full flex gap-8 items-center bg-neutral-950/75" onClick={(e) => e.stopPropagation()}>
                        <div className="text-neutral-50">{videoTime}</div>
                        <div
                            className="flex items-center flex-grow"
                            // onMouseDown={(e) => videoSeeking(e)}
                            // onTouchStart={(e) => videoSeeking(e)}
                            // onTouchMove={(e) => e.stopPropagation()}
                        >
                            <div ref={videoSeekingRef} className="h-2 w-full relative bg-neutral-800 rounded cursor-pointer">
                                <div ref={bufferBarRef} className="top-0 bottom-0 left-0 bg-neutral-500 rounded"></div>
                                <div ref={progressBarRef} className="absolute top-0 bottom-0 left-0 bg-sky-700 rounded cursor-pointer">
                                    <div className="absolute h-4 w-4 right-0 bg-slate-100 rounded-full -translate-y-1/4 cursor-pointer"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-neutral-50">{videoEnd}</div>
                        <img src="Fullscreen.svg" className="h-full py-1 object-contain cursor-pointer" onClick={() => setFullScreen()} />
                    </div>
                </div>
                <div
                    className="tap-backward"
                    // onClick={(e) => seekOnDblClick(e, -10)}
                ></div>
                    <div
                        className="tap-forward"
                        // onClick={(e) => seekOnDblClick(e, 10)}`
                ></div>
            </div>
        </div>
    )
}