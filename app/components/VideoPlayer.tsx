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
            let width = container.clientWidth
            let height = (width / 16) * 9

            if (height > container.clientHeight * 0.5) {
                height = container.clientHeight * 0.5
                width = (height / 9) * 16
            } 
            videoContainer.style.width = width + "px"
            videoContainer.style.height = height + "px"
        }
        
        resize()
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [videoContainerRef, containerRef])


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

        if (!video || !overlay || !playBtn || !pauseBtn || !video.src)
            return
        
        if (video.ended)
            video.currentTime = 0
        
        if (video.paused) {
            try {
                video.play()
            } catch (ex) {
                router.refresh()
            }
            
            overlay.classList.remove("!opacity-100", "!visible")
            overlay.classList.add("opacity-0", "insivible")
            playBtn.classList.add('hidden')
            pauseBtn.classList.remove('hidden')
            
        } else {
            try {
                video.pause()
            } catch (ex) {
                router.refresh()
            }
            
            overlay.classList.add("!opacity-100", "!visible")
            overlay.classList.remove("opacity-0", "insivible")
            pauseBtn.classList.add('hidden')
            playBtn.classList.remove('hidden')
        }
    }

    function beforePlaying() {
        const overlay = overlayRef.current
        const playBtn = playBtnRef.current
        const pauseBtn = pauseBtnRef.current

        if (!overlay || !playBtn || !pauseBtn)
            return

        overlay.classList.remove("!opacity-100", "!visible")
        playBtn.classList.add("hidden")
        pauseBtn.classList.remove("hidden")
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

        const time = video.duration || video.buffered.end(video.buffered.length - 1)

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

        if (!video.paused)
            progress.style.width = `${position * 100}%`

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
        
        buffer.style.width = `${position * 100}%`
        setDuration(videoDuration)
        setVideoEnd(getTimeString(videoDuration))
    }

    function toggleOverlay(e: React.MouseEvent|null) {
        e?.stopPropagation()
        const overlay = overlayRef.current
        
        if (!overlay)
        return
        
        if (overlay.classList.contains("invisible"))
            showOverlay()
        else
            hideOverlay()
    }

    function hideOverlay() {
        const overlay = overlayRef.current

        if (!overlay)
            return

        overlay.classList.add("opacity-0", "invisible")
    }

    function showOverlay() {
        const overlay = overlayRef.current
        const video = videoRef.current
        let n: number = 0;

        if (!overlay || !video || !video.src)
            return

        overlayTimeouts.forEach(t => {
            clearTimeout(t)
            n ++
        })
        overlayTimeouts.splice(0, n)
        overlay.classList.remove("opacity-0", "invisible")

        overlayTimeouts.push(setTimeout(() => {
            overlay.classList.add("opacity-0", "invisible")
        }, 2000))
    }

    function videoSeekingOnMouseDown(e: React.MouseEvent) {
        const video = videoRef.current
        const seekBar = videoSeekingRef.current
        const head = trackingHeadRef.current
        const progressBar = progressBarRef.current

        if (!video || !seekBar || !progressBar || !head || !video.src)
            return

        const paused = video.paused
        const start = seekBar.getBoundingClientRect().left
        const end = seekBar.getBoundingClientRect().right
    
        if (!paused)
            playPauseVideo()

        const seek = (e: MouseEvent|React.MouseEvent) => {
            const position = e.clientX
            showOverlay()
            if (position >= start && position <= end && progressBar) {
                const progressFraction = 1 - (end - position) / (end - start)
                progressBar.style.width = `${progressFraction * 100}%`
                video.currentTime = progressFraction * video.duration || progressFraction * video.buffered.end(video.buffered.length - 1)
            }
        }

        const clear = () => {
            window.removeEventListener("mouseup", clear)
            window.removeEventListener("mousemove", seek)
            if (!paused)                
                playPauseVideo()
        }

        window.addEventListener("mouseup", clear)
        window.addEventListener("mousemove", seek)
        seek(e)
    }
    
    function videoSeekingOnTouchStart(e: React.TouchEvent) {
        e.stopPropagation()

        const video = videoRef.current
        const seekBar = videoSeekingRef.current
        const progressBar = progressBarRef.current

        if (!video || !seekBar || !progressBar|| !video.src || video.seeking || e.touches.length > 1)
            return

        const paused = video.paused
        const start = seekBar.getBoundingClientRect().left
        const end = seekBar.getBoundingClientRect().right

        if (!paused)
            playPauseVideo()

        const seek = (e: TouchEvent|React.TouchEvent) => {
            e.stopPropagation()
            const position = e.touches[0].clientX
            showOverlay()
            if (position >= start && position <= end && progressBar) {
                const progressFraction = 1 - ((end - position) / (end - start))
                progressBar.style.width = progressFraction * 100 + "%"
                video.currentTime = progressFraction * video.duration || progressFraction * video.buffered.end(video.buffered.length - 1)
            }
        }

        const clear = () => {
            window.removeEventListener("touchend", clear)
            window.removeEventListener("touchmove", seek)
            if (!paused)
                playPauseVideo()
        }

        window.addEventListener("touchend", clear)
        window.addEventListener("touchmove", seek)
        seek(e)
    }

    function seekOnDblClick(e: React.MouseEvent, value: number) {
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
            removeTimeouts()
            showOverlay()
            const time = video.currentTime

            if (value > 0 && value + time <= duration)
                video.currentTime = time + value
            else if (value < 0 && value + time >= 0)
                video.currentTime = time + value
        }
        
        if (dblClicksTimeouts.length === 0) {
            toggleOverlay(null)
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

        overlay.classList.add("!opacity-100" ,"!visible")
        playBtn.classList.remove("hidden")
        pauseBtn.classList.add("hidden")
    }

    function loadingImage() {
        const video = videoRef.current
        if (!video)
            return null

        if (video.src || isLiveStream)
            return <img src="Loading.svg" alt="loading icon" className="w-1/12 object-contain animate-spin"/>
        else
            return <img src="logo.png" alt="cat picture" className="h-full w-full object-contain object-bottom"/>
    }

    return (
        <div className="pt-3 flex max-h-1/2 justify-center">
            <div ref={videoContainerRef} className="w-full h-full relative rounded overflow-hidden shadow-md">
                <video
                    className="w-full h-full object-fill scale-100 rounded bg-loading bg-no-repeat bg-center"
                    ref={videoRef}
                    onTimeUpdate={() => updateProgressBar()}
                    onProgress={() => updateBufferBar()}
                    onLoadedMetadata={() => updateDuration()}
                    onLoadedData={() => beforePlaying()}
                    onEnded={() => onVideoEnd()}
                    onClick={() => showOverlay()}
                    onMouseMove={() => showOverlay()}
                    autoPlay
                    muted
                    playsInline
                    controlsList="noremoteplayback nufullscreen nodownload"
                    poster=""
                >
                    Your browser does not support HTML5 video.
                </video>
                <div className="absolute -z-10 top-0 bottom-0 left-0 right-0 flex justify-center items-center">
                    { loadingImage() }
                </div>
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 opacity-0 invisible duration-500"
                    ref={overlayRef}
                    onClick={(e) => toggleOverlay(e)}
                    onMouseMove={() => showOverlay()}
                >
                    <div className="absolute top-1/4 sm:top-1/3 left-1/2 w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gray-950/75 cursor-pointer -translate-x-1/2" onClick={() => playPauseVideo()}>
                        <img ref={playBtnRef}  className="absolute p-4 lg:p-6 top-0 left-0 right-0 bottom-0 object-contain hidden" src="Play.svg" alt="play button" />
                        <img ref={pauseBtnRef} className="absolute p-4 lg:p-6 top-0 left-0 right-0 bottom-0 object-contain" src="Pause.svg" alt="pause button" />
                    </div>

                    <div className="px-3 lg:px-5 absolute h-8 bottom-0 w-full flex gap-3 items-center bg-gray-950/75" onClick={(e) => e.stopPropagation()}>
                        <div className="text-gray-50 lg:pl-6">{videoTime}</div>
                        <div
                            className="flex items-center flex-grow"
                            onMouseDown={(e) => videoSeekingOnMouseDown(e)}
                            onTouchStart={(e) => videoSeekingOnTouchStart(e)}
                        >
                            <div ref={videoSeekingRef} className="h-2 w-full relative bg-gray-800 rounded cursor-pointer">
                                <div ref={bufferBarRef} className="absolute top-0 bottom-0 left-0 bg-gray-500 rounded"></div>
                                <div ref={progressBarRef} className="absolute top-0 bottom-0 left-0 bg-sky-700 rounded cursor-pointer">
                                    <div ref={trackingHeadRef} className="absolute h-4 w-4 -top-1 -right-1 bg-slate-100 rounded-full cursor-pointer translate-x-1/4"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-50 lg:pr-3">{videoEnd}</div>
                        <img src="Fullscreen.svg" alt="fullscreen icon" className="h-full py-1.5 object-contain cursor-pointer" onClick={() => setFullScreen()} />
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