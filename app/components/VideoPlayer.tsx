import React from "react"
import Hls from "hls.js"
import { useRouter } from "next/navigation"

export default function VideoPlayer({ videoSource, videoRef, containerRef, isLiveStream }: { videoSource: string|null, videoRef: React.MutableRefObject<HTMLVideoElement|null>, containerRef: React.MutableRefObject<HTMLDivElement|null>, isLiveStream: boolean }) {

    const [videoTime, setVideoTime] = React.useState<string>("")
    const [videoEnd, setVideoEnd] = React.useState<string>("")
    const [duration, setDuration] = React.useState<number>(0)
    const [overlayTimeouts] = React.useState<any[]>([])
    const [dblClicksTimeouts] = React.useState<any[]>([])
    const videoContainerRef = React.useRef<HTMLDivElement|null>(null)
    const overlayRef = React.useRef<HTMLDivElement|null>(null)
    const playBtnRef = React.useRef<HTMLImageElement|null>(null)
    const pauseBtnRef = React.useRef<HTMLImageElement|null>(null)
    const videoSeekingRef = React.useRef<HTMLDivElement|null>(null)
    const progressBarRef = React.useRef<HTMLDivElement|null>(null)
    const bufferBarRef = React.useRef<HTMLDivElement|null>(null)
    const trackingHeadRef = React.useRef<HTMLDivElement|null>(null)
    const router = useRouter()


    React.useEffect(() => {
        const video = videoRef.current
        const progress = progressBarRef.current

        if (!video || !videoSource || !progress)
            return

        progress.style.left = ""
        progress.style.right = ""
        
        if (isLiveStream && Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(videoSource)
            hls.attachMedia(video)
            
        } else 
            video.src = videoSource
    }, [videoSource, videoRef, isLiveStream])


    // Resize streaming or recording video element when resizing window
    React.useEffect(() => {
        const videoContainer = videoContainerRef.current
        const container = containerRef.current

        if (!container || !videoContainer)
            return

        const resize = () => {
            videoContainer.style.width = container.clientWidth + "px"
            videoContainer.style.height = (container.clientWidth / 16) * 9 + "px"
        }
        
        resize()
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [videoContainerRef])


    function setFullScreen() {
        const video = videoRef.current
        if (!video)
            return

        if (video.requestFullscreen)
            video.requestFullscreen()
    }

    function playPauseVideo() {
        const video = videoRef.current
        const overlay = overlayRef.current
        const playBtn = playBtnRef.current
        const pauseBtn = pauseBtnRef.current

        if (!video || !overlay || !playBtn || !pauseBtn)
            return
        
        if (video.ended)
            video.currentTime = 0

        if (video.paused) {
            try {
                video.play()
            } catch (ex) {
                router.refresh()
            }
            
            overlay.classList.remove("opacity-100")
            pauseBtn.classList.add('opacity-0')
            playBtn.classList.remove('opacity-0')
            
        } else if (!video.paused) {
            try {
                video.pause()
            } catch (ex) {
                router.refresh()
            }

            overlay.classList.add("opacity-100")
            playBtn.classList.add('opacity-0')
            pauseBtn.classList.remove('opacity-0')
        }
    }

    function getTimeString(time: number) {
        let seconds = Math.floor(time % 60).toString()
        const minutes = Math.floor(time / 60).toString()

        if (seconds.length === 1)
            seconds = "0" + seconds

        return minutes + ":" + seconds
    }

    function updateDuration() {
        const video = videoRef.current
        if (!video)
            return

        const time = video.duration

        setDuration(time)
        setVideoEnd(getTimeString(time))
    }

    function updateProgressBar() {
        const video = videoRef.current
        const progress = progressBarRef.current
        const head = trackingHeadRef.current
        
        if (duration <= 0 || !video || !progress || !head)
            return
        const time = video.currentTime
        let position = time / duration

        if (position > 1)
            position = 1
        else if (position < 0)
            position = 0

        progress.style.transform = `scaleX(${position})`
        head.style.transform = `scaleX(${1 / position})`
        setVideoTime(getTimeString(time))
    }

    function updateBufferBar() {
        const video = videoRef.current
        const buffer = bufferBarRef.current
        
        if (!video || !buffer)
        return
    
        const buffers = video.buffered

        if (!buffers.length)
            return

        const end = buffers.end(buffers.length - 1)
        const videoDuration = video.duration || end

        let position = end / videoDuration

        if (position > 1)
            position = 1
        else if (position < 0)
            position = 0

        buffer.style.transform = `scaleX(${position})`
        setDuration(videoDuration)
        setVideoEnd(getTimeString(videoDuration))
    }

    function toggleOverlay() {
        const overlay = overlayRef.current
        
        if (!overlay)
        return
        
        if (overlay.classList.contains("opacity-0"))
            showOverlay()
        else
            hideOverlay()
    }

    function hideOverlay() {
        const overlay = overlayRef.current

        if (!overlay)
            return

        overlay.classList.add("opacity-0")
    }

    function showOverlay() {
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

    function videoSeekingOnMouseDown(e: React.MouseEvent) {
        const video = videoRef.current
        const seekBar = videoSeekingRef.current
        const head = trackingHeadRef.current
        const progressBar = progressBarRef.current

        if (!video || !seekBar || !progressBar || !head)
            return

        const paused = video.paused
        const start = seekBar.getBoundingClientRect().left
        const end = seekBar.getBoundingClientRect().right

        if (video.seeking)
            return

        if (!paused) {
            playPauseVideo()
        }

        const seek = (e: MouseEvent|React.MouseEvent) => {
            const position = e.clientX
            showOverlay()
            if (position >= start && position <= end && progressBar) {
                const progressFraction = 1 - (end - position) / (end - start)
                progressBar.style.transform = `scaleX(${progressFraction})`
                head.style.transform = `scaleX(${1 / progressFraction})`
                video.currentTime = progressFraction * video.duration
            }
        }

        const clear = () => {
            window.removeEventListener("mouseup", clear)
            window.removeEventListener("mousemove", seek)
            if (!paused) {
                playPauseVideo()
            }
        }

        window.addEventListener("mouseup", clear)
        window.addEventListener("mousemove", seek)
        seek(e)
    }
    
    function videoSeekingOnTouchStart(e: React.TouchEvent) {
        const video = videoRef.current
        const seekBar = videoSeekingRef.current

        if (!video || !seekBar || e.touches.length > 1)
            return

        const paused = video.paused
        const progressBar = progressBarRef.current
        const start = seekBar.getBoundingClientRect().left
        const end = seekBar.getBoundingClientRect().right

        if (video.seeking)
            return

        if (!paused) {
            playPauseVideo()
        }

        const seek = (e: TouchEvent|React.TouchEvent) => {
            const position = e.touches[0].clientX
            showOverlay()
            if (position >= start && position <= end && progressBar) {
                const progressFraction = 1 - ((end - position) / (end - start))
                progressBar.style.width = progressFraction * 100 + "%"
                video.currentTime = progressFraction * duration
            }
        }

        const clear = () => {
            seekBar.removeEventListener("touchend", clear)
            seekBar.removeEventListener("touchmove", seek)
            if (!paused) {
                playPauseVideo()
            }
        }

        seekBar.addEventListener("touchend", clear)
        seekBar.addEventListener("touchmove", seek)
        seek(e)
    }

    const seekOnDblClick = (e: React.MouseEvent, value: number) => {
        const video = videoRef.current
        if (!video)
            return
    
        e.stopPropagation()
        const removeTimeouts = () => {
            let n: number = 0
            dblClicksTimeouts.forEach(t => {
                clearTimeout(t)
                n++
            })
            dblClicksTimeouts.splice(0, n)
        }
        const seek = () => {
            e.stopPropagation()
            removeTimeouts()
            showOverlay()
            const time = video.currentTime

            if (value > 0 && value + time <= duration)
                video.currentTime = time + value
            else if (value < 0 && value + time >= 0)
                video.currentTime = time + value
        }
        
        if (dblClicksTimeouts.length === 0) {
            toggleOverlay()
            dblClicksTimeouts.push(setTimeout(() => {
                removeTimeouts()
            }, 300))
        } else if (dblClicksTimeouts.length === 1)
            seek()
    }

    const onVideoEnd = () => {
        const playBtn = playBtnRef.current
        const pauseBtn = pauseBtnRef.current
        const overlay = overlayRef.current
        
        if (!playBtn || !pauseBtn || !overlay)
            return 

        overlay.classList.add("opacity-100")
        playBtn.classList.remove("opacity-0")
        pauseBtn.classList.add("opacity-0")
    }

    if (!videoSource)
        return (
            <div ref={videoContainerRef} className="rounded">
                <img src="logo.png" alt="cat logo" className="w-full h-full object-contain"/>
            </div>
        )

    return (
        <div className="pt-3 flex justify-center">
            <div ref={videoContainerRef} className="w-full h-full relative rounded overflow-hidden">
                <video
                    className="w-full h-full object-fill scale-100 rounded"
                    ref={videoRef}
                    onTimeUpdate={() => updateProgressBar()}
                    onProgress={() => updateBufferBar()}
                    onLoadedMetadata={() => updateDuration()}
                    onPause={() => overlayRef.current?.classList.add("opacity-100")}
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
                    className="absolute top-0 left-0 right-0 bottom-0 opacity-0 duration-1000"
                    ref={overlayRef}
                    onClick={() => toggleOverlay()}
                    onMouseMove={() => showOverlay()}
                >
                    <div className="absolute top-1/3 left-1/2 w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-neutral-950/75 cursor-pointer -translate-x-1/2" onClick={() => playPauseVideo()}>
                        <img ref={playBtnRef}  className="absolute p-4 lg:p-6 top-0 left-0 right-0 bottom-0 object-contain duration-200" src="Pause.svg" />
                        <img ref={pauseBtnRef} className="absolute p-4 lg:p-6 top-0 left-0 right-0 bottom-0 object-contain duration-200 opacity-0" src="Play.svg" />
                    </div>

                    <div className="px-3 lg:px-5 absolute h-8 bottom-0 w-full flex gap-2 items-center bg-neutral-950/75" onClick={(e) => e.stopPropagation()}>
                        <div className="text-neutral-50 lg:pl-6">{videoTime}</div>
                        <div
                            className="flex items-center flex-grow"
                            onMouseDown={(e) => videoSeekingOnMouseDown(e)}
                            onTouchStart={(e) => videoSeekingOnTouchStart(e)}
                        >
                            <div ref={videoSeekingRef} className="h-2 w-full relative bg-neutral-800 rounded cursor-pointer">
                                <div ref={bufferBarRef} className="top-0 bottom-0 left-0 w-full bg-neutral-500 rounded origin-left"></div>
                                <div ref={progressBarRef} className="absolute top-0 bottom-0 left-0 w-full bg-sky-700 rounded cursor-pointer origin-left">
                                    <div ref={trackingHeadRef} className="absolute h-4 w-4 -top-1 -right-1 bg-slate-100 rounded-full cursor-pointer"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-neutral-50 lg:pr-6">{videoEnd}</div>
                        <img src="Fullscreen.svg" className="h-full py-1 object-contain cursor-pointer" onClick={() => setFullScreen()} />
                    </div>
                    <div
                        className=" absolute top-0 bottom-8 left-0 w-1/5"
                        onClick={(e) => seekOnDblClick(e, -10)}
                    ></div>
                        <div
                            className="absolute top-0 bottom-8 right-0 w-1/5"
                            onClick={(e) => seekOnDblClick(e, 10)}
                    ></div>
                </div>
            </div>
        </div>
    )
}