import React from "react"

const ZoomPad = ({ videoRef, containerRef }: { videoRef: React.MutableRefObject<HTMLVideoElement|null>, containerRef: React.MutableRefObject<HTMLDivElement|null> }) => {

    const zoomPadRef = React.useRef<HTMLDivElement|null>(null)

    React.useEffect(() => {
        const zoomPad = zoomPadRef.current
        const container = containerRef.current
        const parent: any = zoomPad?.parentNode

        if (!zoomPad || !container || !parent)
            return
        
        const resize = () => {        
            const parentHeight = parent.clientHeight
            let width = container.clientWidth * 0.8
            let height = (width / 16) * 9
            if (height >= parentHeight) {
                height = parentHeight
                width = (height / 9 * 16)
            }

            zoomPad.style.width = width + "px"
            zoomPad.style.height = height + "px"
            zoomPad.style.minHeight = zoomPad.style.height
            zoomPad.style.maxHeight = zoomPad.style.height
        }

        resize()
        window.addEventListener("resize", resize)

        return () => {
            window.removeEventListener("resize", resize)
        }
    }, [containerRef])

    const zoomVideoOnMouse = (e: React.MouseEvent) => {
        e.stopPropagation()

        const video = videoRef.current
        const container = containerRef.current
        const zoomPad = zoomPadRef.current?.getBoundingClientRect()

        if (!video || !container || !zoomPad)
            return

        const zoom = (e: MouseEvent|React.MouseEvent) => {
            const x = e.clientX
            const y = e.clientY
            let zoomX = ((x - zoomPad.left) / (zoomPad.right - zoomPad.left)) * 100
            let zoomY = ((y - zoomPad.top) / (zoomPad.bottom - zoomPad.top)) * 100
            if (zoomX > 100) zoomX = 100
            else if (zoomX < 0) zoomX = 0

            if (zoomY > 100) zoomY = 100
            else if (zoomY < 0) zoomY = 0
            
            video.style.transform = `scale(4)`
            video.style.transformOrigin = `${zoomX}% ${zoomY}%`
        }

        const clearListeners = () => {
            unZoomVideo()
            window.removeEventListener("mouseup", clearListeners)
            window.removeEventListener("mousemove", zoom)
        }
        
        window.addEventListener("mouseup", clearListeners)
        window.addEventListener("mousemove", zoom)
        zoom(e)
    }

    const zoomVideoOnTouch = (e: React.TouchEvent) => {
        e.stopPropagation()

        const video = videoRef.current
        const container = containerRef.current
        const zoomPad = zoomPadRef.current?.getBoundingClientRect()

        if (!video || !container || !zoomPad || e.touches.length > 1)
            return

        const zoom = () => {
            const x = e.touches[0].clientX
            const y = e.touches[0].clientY
            let zoomX = ((x - zoomPad.left) / (zoomPad.right - zoomPad.left)) * 100
            let zoomY = ((y - zoomPad.top) / (zoomPad.bottom - zoomPad.top)) * 100
            if (zoomX > 100) zoomX = 100
            else if (zoomX < 0) zoomX = 0

            if (zoomY > 100) zoomY = 100
            else if (zoomY < 0) zoomY = 0
            
            video.style.transform = `scale(4)`
            video.style.transformOrigin = `${zoomX}% ${zoomY}%`
        }

        const clearListeners = () => {
            unZoomVideo()
            window.removeEventListener("touchend", clearListeners)
            window.removeEventListener("touchmove", zoom)
        }

        window.addEventListener("touchend", clearListeners)
        window.addEventListener("touchmouve", zoom)
    }

    const unZoomVideo = () => {
        const video = videoRef.current
        const container = containerRef.current

        if (!video || !container)
            return

        video.style.transform = ""
        container.classList.remove("no-scroll")
    }

    return (
        <div className="w-full flex-grow flex justify-center items-center">
            <div
                ref={zoomPadRef}
                className="flex justify-center items-center bg-neutral-50 border-double border-8 border-neutral-700 rounded shadow-md"
                onMouseDown={(e) => zoomVideoOnMouse(e)}
                onTouchStart={(e) => zoomVideoOnTouch(e)}
            >
                <h2 className="p-3 text-center text-5xl">Zoom</h2>
            </div>
        </div>
    )
}

export default ZoomPad