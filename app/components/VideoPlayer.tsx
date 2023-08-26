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
    const playPause = React.useRef<HTMLButtonElement|null>(null)
    const videoSeekingRef = React.useRef<HTMLDivElement|null>(null)
    const progressBarRef = React.useRef<HTMLDivElement|null>(null)
    const bufferBarRef = React.useRef<HTMLDivElement|null>(null)
    const router = useRouter()

    React.useEffect(() => {
        const video = videoRef.current
        // const progress = progressBarRef.current

        if (!videoSource)
            return

        // progress.style.left = ""
        // progress.style.right = ""
        
        if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(videoSource)
            hls.attachMedia(video)
        } else 
            video.src = videoSource

        console.log(video.src);
        
    }, [videoSource, videoRef])


    // Resize streaming or recording video element when resizing window
    React.useEffect(() => {
        const video = videoContainerRef.current
        if (!video)
            return

        const resize = () => {
            video.style.height = (video.clientWidth / 16) * 9 + "px"
        }

        video.style.height = (video.clientWidth / 16) * 9 + "px"
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [videoSource])


    const setFullScreen = () => {
        const video = videoRef.current
        if (!video)
            return

        if (video.requestFullscreen)
            video.requestFullscreen()
    }

    const playPauseVideo = async () => {
        const video = videoRef.current
        const overlay = overlayRef.current
        const playPauseBtn = playPause.current

        if (!video || !overlay || !playPauseBtn)
            return
        
        if (video.ended)
            video.currentTime = 0

        if (video.paused) {
            try {
                await video.play()
                playPauseBtn.classList.add("pause")
                overlay.classList.remove("visible-important")
            } catch (ex) {
                window.location.reload()
            }
        } else if (!video.paused) {
            try {
                video.pause()
                playPauseBtn.classList.remove("pause")
            } catch (ex) {
                window.location.reload()
            }
        }
    }

    // const getTimeString = (time: number) => {
    //     let seconds = Math.floor(time % 60).toString()
    //     const minutes = Math.floor(time / 60).toString()

    //     if (seconds.length === 1)
    //         seconds = "0" + seconds

    //     return minutes + ":" + seconds
    // }

    // const updateDuration = () => {
    //     const video = videoRef.current
    //     if (!video)
    //         return

    //     const time = video.duration

    //     setDuration(time)
    //     setVideoEnd(getTimeString(time))
    // }

    // const updateProgressBar = () => {
    //     const video = videoRef.current
    //     const progress = progressBarRef.current
        
    //     if (duration <= 0 || !video || !progress)
    //         return

    //     const time = video.currentTime

    //     progress.style.width = (time / duration) * 100 + "%"
    //     setVideoTime(getTimeString(time))
    // }

    // const updateBufferBar = () => {
    //     const video = videoRef.current
    //     const buffer = bufferBarRef.current
        
    //     if (!video || !buffer)
    //     return
    
    //     const buffers = video.buffered

    //     if (!buffers.length)
    //         return

    //     const end = buffers.end(buffers.length - 1)
    //     const videoDuration = video.duration || end

    //     let position = 100 - ((end / videoDuration) * 100)

    //     if (position > 100)
    //         position = 100
    //     else if (position < 0)
    //         position = 0

    //     buffer.style.left = "0"
    //     buffer.style.right = position + "%"
    //     setDuration(videoDuration)
    //     setVideoEnd(getTimeString(videoDuration))
    // }

    // const toggleOverlay = (e: React.MouseEvent) => {
    //     e.stopPropagation()
    //     const overlay = overlayRef.current

    //     if (!overlay)
    //         return

    //     if (overlay.classList.contains("video-overlay-visible"))
    //         hideOverlay(e)
    //     else
    //         showOverlay(e)
    // }

    // const hideOverlay = (e: React.MouseEvent) => {
    //     e.stopPropagation()
    //     const overlay = overlayRef.current

    //     if (!overlay)
    //         return

    //     overlay.classList.remove("video-overlay-visible")
    //     overlay.classList.remove("visible-important")
    // }

    // const showOverlay = (e: React.MouseEvent) => {
    //     e.stopPropagation()

    //     const overlay = overlayRef.current
    //     let n: number = 0;

    //     if (!overlay)
    //         return

    //     overlayTimeouts.forEach(t => {
    //         clearTimeout(t)
    //         n ++
    //     })
    //     overlayTimeouts.splice(0, n)
    //     overlay.classList.add("video-overlay-visible")

    //     overlayTimeouts.push(setTimeout(() => {
    //         overlay.classList.remove("video-overlay-visible")
    //     }, 2000))
    // }

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

    // const onVideoEnd = () => {
    //     playPause.current.classList.remove("pause")
    //     overlayRef.current.classList.add("visible-important")
    // }

    return (
        <div className="flex justify-center">
            <div ref={videoContainerRef} className="video-container">
                <video
                    // ref={videoRef}
                    // onTimeUpdate={() => updateProgressBar()}
                    // onProgress={() => updateBufferBar()}
                    // onLoadedMetadata={() => updateDuration()}
                    // onLoadedData={() => playPauseVideo()}
                    // onPause={() => overlayRef.current.classList.add("visible-important")}
                    // onEnded={() => onVideoEnd()}
                    // onMouseMove={(e) => showOverlay(e)}
                    // onClick={(e) => showOverlay(e)}
                    autoPlay
                    muted
                    playsInline
                    controlsList="noremoteplayback nufullscreen nodownload"
                    poster=""
                >
                    Your browser does not support HTML5 video.
                </video>
                
                <div
                    className="video-overlay hidden"
                    ref={overlayRef}
                    // onMouseMove={(e) => showOverlay(e)}
                    // onClick={(e) => toggleOverlay(e)}
                >
                    <div className="button-bg" onClick={() => playPauseVideo()}>
                        <button
                            ref={playPause}
                            className="play-btn"
                        ></button>
                    </div>

                    <div className="bottom" onClick={(e) => e.stopPropagation()}>
                        <div id="current" className="time">{videoTime}</div>
                        <div
                            className="bars"
                            // onMouseDown={(e) => videoSeeking(e)}
                            // onTouchStart={(e) => videoSeeking(e)}
                            // onTouchMove={(e) => e.stopPropagation()}
                        >
                            <div ref={videoSeekingRef} className="seeking">
                                <div ref={bufferBarRef} className="buffer"></div>
                                <div ref={progressBarRef} className="progress">
                                    <div className="progress-btn"></div>
                                </div>
                            </div>
                        </div>
                        <div id="end" className="time">{videoEnd}</div>
                        <button className="fullscreen-btn" onClick={() => setFullScreen()}>⛶</button>
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