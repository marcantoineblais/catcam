import React from "react"

const ZoomPad = ({ videoRef, containerRef }: { videoRef: React.MutableRefObject<HTMLVideoElement|null>, containerRef: React.MutableRefObject<HTMLDivElement|null> }) => {

    const zoomPadRef = React.useRef<HTMLDivElement|null>(null)

    // Always keep the pad at a 16:9 ratio and make sure it fits inside his parent
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
            if (height >= parentHeight * 0.8) {
                height = parentHeight * 0.8
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
    }, [containerRef, zoomPadRef])

    // Activate zoom and mouse move tracking on click down, release on click up
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
        
        container.classList.add("overflow-hidden")
        window.addEventListener("mouseup", clearListeners)
        window.addEventListener("mousemove", zoom)
        zoom(e)
    }

    // Activate zoom and touch move tracking on touch start, release on touch end
    const zoomVideoOnTouch = (e: React.TouchEvent) => {
        e.stopPropagation()

        const video = videoRef.current
        const container = containerRef.current
        const zoomPad = zoomPadRef.current?.getBoundingClientRect()

        if (!video || !container || !zoomPad || e.touches.length > 1)
            return

        const x = e.touches[0].clientX
        const y = e.touches[0].clientY
        const zoomX = ((x - zoomPad.left) / (zoomPad.right - zoomPad.left)) * 100
        const zoomY = ((y - zoomPad.top) / (zoomPad.bottom - zoomPad.top)) * 100
        
        const zoom = (e: TouchEvent) => {
            e.stopPropagation()
            
            const x = e.touches[0].clientX
            const y = e.touches[0].clientY
            let zoomX = ((x - zoomPad.left) / (zoomPad.right - zoomPad.left)) * 100
            let zoomY = ((y - zoomPad.top) / (zoomPad.bottom - zoomPad.top)) * 100
            if (zoomX > 100) zoomX = 100
            else if (zoomX < 0) zoomX = 0

            if (zoomY > 100) zoomY = 100
            else if (zoomY < 0) zoomY = 0
            
            video.style.transformOrigin = `${zoomX}% ${zoomY}%`
        }

        const clearListeners = () => {
            unZoomVideo()
            window.removeEventListener("touchend", clearListeners)
            window.removeEventListener("touchmove", zoom)
        }

        container.classList.add("overflow-hidden")
        window.addEventListener("touchend", clearListeners)
        window.addEventListener("touchmove", zoom)

        video.style.transform = `scale(4)`
        video.style.transformOrigin = `${zoomX}% ${zoomY}%`
    }

    const unZoomVideo = () => {
        const video = videoRef.current
        const container = containerRef.current

        if (!video || !container)
            return

        video.style.transform = ""
        container.classList.remove("overflow-hidden")
    }

    return (
        <div className="h-full flex-grow flex justify-center items-center">
            <div
                ref={zoomPadRef}
                className="flex justify-center items-center bg-gray-300 border-8 border-gray-50 rounded shadow dark:shadow-zinc-50/10 dark:bg-zinc-800 dark:border-zinc-700"
                onMouseDown={(e) => zoomVideoOnMouse(e)}
                onTouchStart={(e) => zoomVideoOnTouch(e)}
            >
                <h2 className="p-3 text-center text-3xl font-extrabold tracking-widest">ZOOM</h2>
            </div>
        </div>
    )
}

export default ZoomPad