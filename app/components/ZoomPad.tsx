import { useEffect, useRef } from "react"
import "../style/ZoomPad.scss"

const ZoomPad = ({ videoRef, containerRef }) => {

    const zoomPadRef = useRef()

    useEffect(() => {
        const zoomPad = zoomPadRef.current
        const parent = zoomPad.parentNode
        const container = containerRef.current
        
        const resize = () => {        
            const parentHeight = parent.clientHeight
            let width = container.clientWidth * 0.8
            let height = (width / 16) * 9
            if (height >= parentHeight) {
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
    }, [containerRef])

    const zoomVideo = (e) => {
        e.stopPropagation()

        const video = videoRef.current
        const container = containerRef.current
        const zoomPad = zoomPadRef.current.getBoundingClientRect()
        const x = e.clientX || e.touches[0].clientX
        const y = e.clientY || e.touches[0].clientY
        const zoomX = ((x - zoomPad.left) / (zoomPad.right - zoomPad.left)) * 100
        const zoomY = ((y - zoomPad.top) / (zoomPad.bottom - zoomPad.top)) * 100
        
        container.classList.add("no-scroll")
        video.style.transform = `scale(4)`
        video.style.transformOrigin = `${zoomX}% ${zoomY}%`

        const clearListeners = () => {
            unZoomVideo()
            window.removeEventListener("mouseup", clearListeners)
        }

        window.addEventListener("mouseup", clearListeners)
    }

    const unZoomVideo = () => {
        const video = videoRef.current
        const container = containerRef.current
        video.style.transform = ""
        container.classList.remove("no-scroll")
    }

    const trackZoom = (e) => {
        if (e.touches && e.touches.length > 1) {
            unZoomVideo()
            return
        }
        
        const video = videoRef.current
        const zoomPad = zoomPadRef.current.getBoundingClientRect()
        const x = e.clientX || e.touches[0].clientX
        const y = e.clientY || e.touches[0].clientY
        let zoomX = ((x - zoomPad.left) / (zoomPad.right - zoomPad.left)) * 100
        let zoomY = ((y - zoomPad.top) / (zoomPad.bottom - zoomPad.top)) * 100

        if (zoomX > 100)
            zoomX = 100
        else if (zoomX < 0)
            zoomX = 0

        if (zoomY > 100)
            zoomY = 100
        else if (zoomY < 0)
            zoomY = 0

        video.style.transformOrigin = `${zoomX}% ${zoomY}%`
    }

    const handleScroll = (e) => {
        if (e.touches.length < 2 && e.target !== e.currentTarget)
            e.stopPropagation()
    }

    return (
        <div className="zoom-pad-container" onTouchMove={(e) => handleScroll(e)}>
            <div
                ref={zoomPadRef}
                className="zoom-pad"
                onMouseDown={(e) => zoomVideo(e)}
                onTouchStart={(e) => zoomVideo(e)}
                onTouchEnd={(e) => unZoomVideo(e)}
                onMouseMove={(e) => trackZoom(e)}
                onTouchMove={(e) => trackZoom(e)}
                onTouchCancel={() => unZoomVideo()}
            >
                <h2>Zoom</h2>
            </div>
        </div>
    )
}

export default ZoomPad