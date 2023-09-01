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

    // Use HLS plugin only when required
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


    // Resize streaming or recording video element when resizing window (16:9 ratio)
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

    // Fullscreen video
    function setFullScreen() {
        const video = videoRef.current
        if (!video)
            return

        if (video.requestFullscreen)
            video.requestFullscreen()
    }

    // Toggle between play and pause
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
                console.log("Playback issue just occured, reload if video is broken.")
                
            }
            
            overlay.classList.remove("!opacity-100", "!visible")
            overlay.classList.add("opacity-0", "insivible")
            playBtn.classList.add('hidden')
            pauseBtn.classList.remove('hidden')
            
        } else {
            try {
                video.pause()
            } catch (ex) {
                console.log("Playback issue just occured, reload if video is broken.")
            }
            
            overlay.classList.add("!opacity-100", "!visible")
            overlay.classList.remove("opacity-0", "insivible")
            pauseBtn.classList.add('hidden')
            playBtn.classList.remove('hidden')
        }
    }

    // Reset overlay before playing new video
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

    // Convert the duration number into a string (m:ss)
    function getTimeString(time: number) {
        let seconds = Math.floor(time % 60).toString()
        const minutes = Math.floor(time / 60).toString()

        if (seconds.length === 1)
            seconds = "0" + seconds

        return minutes + ":" + seconds
    }

    // Update video length when new metadata is loaded
    function updateDuration() {
        const video = videoRef.current
        
        if (!video)
            return

        const time = video.duration || video.buffered.end(video.buffered.length - 1)

        setDuration(time)
        setVideoEnd(getTimeString(time))
    }

    // Adjust the progress bar size when time passes
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

    // Adjust the buffer bar sizes when data is loaded
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

    // Open overlay when closed and vice-versa
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

    // Open overlay and create timeout to close it
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

    // Make the progress bar clickable to seek in video
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
    
    // Make the progress bar touchable to seek in video
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

    // seek forward or backward when double clicking sides of the video
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
            else if (value > 0) {
                video.currentTime = duration
                updateProgressBar()
            } else if (value < 0 && value + time >= 0)
                video.currentTime = time + value
            else
                video.currentTime = 0
        }
        
        if (dblClicksTimeouts.length === 0) {
            toggleOverlay(null)
            dblClicksTimeouts.push(setTimeout(() => {
                removeTimeouts()
            }, 300))
        } else if (dblClicksTimeouts.length === 1)
            seek()
    }

    // show overlay when video ends
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

    // Load logo when no video is selected, load loading svg when src is selected and video is loading
    function loadingImage() {
        const video = videoRef.current
        if (!video)
            return null

        if (video.src || isLiveStream) {
            return (
                <div className="w-1/12 animate-spin">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                        <path fill="currentColor" d="M167.07,81.76c4-1.71,8.07-3.28,12.27-4.64a143.16,143.16,0,0,1,73.21-16.37,189.21,189.21,0,0,1,95.89,25.94L386.9,116.4a190,190,0,0,1,48.86,83.84q3.39,25.26,6.79,50.51A143.16,143.16,0,0,1,426.18,324q-2.08,6.39-4.72,12.46,16.44,16.68,32.82,33.4a231.42,231.42,0,0,0,31.55-117c0-128.49-104.16-232.65-232.64-232.65A231.57,231.57,0,0,0,136.46,51.56Q151.79,66.63,167.07,81.76Z"/>
                        <path fill="currentColor" d="M347,439.78,329.87,423c-1.36.49-2.73,1-4.12,1.42a143,143,0,0,1-73.2,16.36,189,189,0,0,1-95.9-25.94Q137.42,400,118.2,385.1a189.79,189.79,0,0,1-48.87-83.84l-6.78-50.51a143,143,0,0,1,16.36-73.2c.38-1.17.78-2.33,1.19-3.48q-15.82-15.93-31.58-31.9a231.46,231.46,0,0,0-28,110.66c0,128.48,104.15,232.64,232.64,232.64A231.56,231.56,0,0,0,364.72,457Z"/>
                    </svg>
                </div>
            )
        } else
            return <img src="logo.png" alt="cat picture" className="h-full w-full object-contain object-bottom"/>
    }

    return (
        <div className="pt-3 flex max-h-1/2 justify-center text-gray-50 dark:text-gray-200">
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
                        <div ref={playBtnRef}  className="absolute p-4 lg:p-6 top-0 left-0 right-0 bottom-0 hidden">
                            <svg fill="currentColor" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                                <path d="M471.25,246.56,28.64,18.49A3.87,3.87,0,0,0,23,21.93V478.07a3.87,3.87,0,0,0,5.64,3.44L471.25,253.44A3.87,3.87,0,0,0,471.25,246.56Z"/>
                            </svg>
                        </div>
                        <div ref={pauseBtnRef} className="absolute p-4 lg:p-6 top-0 left-0 right-0 bottom-0">
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                                <rect fill="currentColor" x="26.88" y="20.18" width="152" height="463.89" rx="4.12"/>
                                <rect fill="currentColor" x="322.21" y="20.18" width="152" height="463.89" rx="4.12"/>
                            </svg>
                        </div>
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
                                    <div ref={trackingHeadRef} className="absolute h-4 w-4 -top-1 -right-1 bg-gray-100 rounded-full cursor-pointer translate-x-1/4"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-50 lg:pr-3">{videoEnd}</div>
                        <div className="h-5 w-5 flex items-center cursor-pointer" onClick={() => setFullScreen()}>
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                                <rect fill="currentColor" x="17.53" y="450.24" width="155.05" height="32.47" rx="4.01" transform="translate(190.12 932.94) rotate(-180)"/>
                                <rect fill="currentColor" x="-44.21" y="388.5" width="155.95" height="32.47" rx="4.01" transform="translate(-370.96 438.5) rotate(-90)"/>
                                <rect fill="currentColor" x="-41.16" y="81.48" width="155.05" height="32.47" rx="4.01" transform="translate(-61.34 134.08) rotate(-90)"/>
                                <rect fill="currentColor" x="20.13" y="20.18" width="155.95" height="32.47" rx="4.01"/>
                                <rect fill="currentColor" x="322.56" y="19.73" width="155.05" height="32.47" rx="4.01"/>
                                <rect fill="currentColor" x="383.4" y="81.48" width="155.95" height="32.47" rx="4.01" transform="translate(559.09 -363.67) rotate(90)"/>
                                <rect fill="currentColor" x="383.85" y="388.05" width="155.05" height="32.47" rx="4.01" transform="translate(865.66 -57.1) rotate(90)"/>
                                <rect fill="currentColor" x="321.66" y="449.34" width="155.95" height="32.47" rx="4.01" transform="translate(799.27 931.14) rotate(-180)"/>
                            </svg>
                        </div>
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