import { useEffect, useRef, useState } from "react"
import ZoomPad from "./ZoomPad"
import "../style/Recording.scss"


const Recording = ({ recordings, setVideoSource, containerRef, videoRef }) => {

    const [renderedVideoCards, setRenderedVideoCards] = useState(null)
    const [visibleVideoCards, setVisibleVideoCards] = useState(null)
    const [activeVideoIndex, setActiveVideoIndex] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [subMenu, setSubMenu] = useState("recordings")
    const recordingBtnRef = useRef()
    const zoomBtnRef = useRef()
    const scrollableRef = useRef()
    const cardsRef = useRef()
    const zoomPadRef = useRef()
    const pageBtnRef = useRef()
    const nextRef = useRef()
    const previousRef = useRef()


    // Resize cards when resizing window
    useEffect(() => {
        const resize = () => {
            const currentWidth = containerRef.current.clientWidth
            const rowSize = currentWidth > 720 ? 3 : 2
            const width = (currentWidth / rowSize) - 20 + "px"
            const height = (parseInt(width) / 16) * 9 + "px"

            for (let i = 0; i < cardsRef.current.children.length; i++) {
                const card = cardsRef.current.children[i]

                card.children[0].style.width = width
                card.children[0].style.height = height
                card.children[1].style.width = width
            }
        }

        resize()
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [containerRef, visibleVideoCards])

    useEffect(() => {
        if (!renderedVideoCards)
            return

        const currentWidth = containerRef.current.clientWidth
        const rowSize = currentWidth > 720 ? 3 : 2
        const nbOfCards = renderedVideoCards.length
        const startIndex = (currentPage - 1) * 12
        const endIndex = startIndex + 12 > nbOfCards ? nbOfCards : startIndex + 12

        const cards = renderedVideoCards.slice(startIndex, endIndex)
        let key = cards.length
        while (cards.length % rowSize !== 0) {
            cards.push(
                <div key={key++}>
                    <div></div>
                    <div></div>
                </div>
            )
        }
        setVisibleVideoCards(cards)
    }, [currentPage, renderedVideoCards, containerRef])

    useEffect(() => {
        if (!recordings)
            return

        let key = 1;
        const videoOnClick = (e, video, index) => {
            const cards = cardsRef.current
            for (let i = 0; i < cards.children.length; i++) {
                const card = cards.children[i]
                card.classList.remove("active")
            }

            e.currentTarget.classList.add("active")
            setActiveVideoIndex(index)
            setVideoSource({ url: video.videoSource, format: "mp4" })
        }

        const cards = recordings.map((v, i) => {
            const time = v.time.toTimeString().split(" ")[0]
            const date = v.time.toDateString().split(" ").slice(1, 4).join("-")
            const active = i === activeVideoIndex ? "active" : ""

            return (
                <div
                    className={`thumbnail ${active}`}
                    key={key++}
                    onClick={(e) => videoOnClick(e, v, i)}
                >
                    <img src={v.thumbnail} alt="camera snapshot" />
                    <p>{date + ", " + time}</p>
                </div>
            )
        })

        setRenderedVideoCards(cards)
        setLastPage(Math.ceil(cards.length / 12))
    }, [recordings, containerRef, setVideoSource, activeVideoIndex])

    useEffect(() => {
        if (!currentPage)
            return

        const previousBtn = previousRef.current
        const nextBtn = nextRef.current

        if (1 === lastPage) {
            nextBtn.classList.add("hidden")
            previousBtn.classList.add("hidden")
        } else if (currentPage === 1) {
            previousBtn.classList.add("hidden")
            nextBtn.classList.remove("hidden")
        } else if (currentPage === lastPage) {
            nextBtn.classList.add("hidden")
            previousBtn.classList.remove("hidden")
        } else {
            previousBtn.classList.remove("hidden")
            nextBtn.classList.remove("hidden")
        }
    }, [currentPage, lastPage])

    useEffect(() => {
        const recordingsBtn = recordingBtnRef.current
        const zoomBtn = zoomBtnRef.current
        const pageBtn = pageBtnRef.current
        const zoomPad = zoomPadRef.current
        const cards = cardsRef.current

        if (subMenu === "recordings") {
            recordingsBtn.classList.add("active")
            zoomBtn.classList.remove("active")
            zoomPad.classList.add("right")
            cards.classList.remove("left")
            pageBtn.classList.remove("left")
        } else if (subMenu === "zoom") {
            recordingsBtn.classList.remove("active")
            zoomBtn.classList.add("active")
            zoomPad.classList.remove("right")
            cards.classList.add("left")
            pageBtn.classList.add("left")
        }
    }, [subMenu])

    const stopScreenRefreshOnScroll = (e) => {
        const target = e.currentTarget
        const scroll = target.scrollTop

        if (scroll !== 0)
            e.stopPropagation()
    }

    const nextPage = () => {
        const cards = cardsRef.current

        if (currentPage < lastPage) {
            cards.scrollTo(0, 0)
            setCurrentPage(currentPage + 1)
        }
    }

    const previousPage = () => {
        const cards = cardsRef.current

        if (currentPage > 1) {
            cards.scrollTo(0, 0)
            setCurrentPage(currentPage - 1)
        }
    }

    const removeScroll = (e) => {
        const cards = cardsRef.current
        const start = e.touches[0].clientY
        const scrollHeight = cards.scrollHeight
        const height = cards.clientHeight

        const stopScroll = (e) => {
            const position = e.touches[0].clientY
            const cardsScroll = cards.scrollTop

            if (cardsScroll <= 0 && start - position <= 0)
                cards.classList.add("no-scroll")
            else if (scrollHeight - cardsScroll <= height && start - position >= 0)
                cards.classList.add("no-scroll")
            else
                cards.classList.remove("no-scroll")

            if (cardsScroll > 0)
                e.stopPropagation()
        }

        if (cards.scrollTop > 0)
            e.stopPropagation()

        const removeListeners = () => {
            cards.classList.remove("no-scroll")
            cards.removeEventListener("touchmove", stopScroll)
            cards.removeEventListener("touchend", removeListeners)

        }

        cards.addEventListener("touchmove", stopScroll)
        cards.addEventListener("touchend", removeListeners)
    }

    return (
        <div className="recordings-container">
            <div className="recording-buttons">
                <button
                    ref={recordingBtnRef}
                    className="recording-btn active"
                    onClick={() => setSubMenu("recordings")}
                >
                    Recordings
                </button>
                <button
                    ref={zoomBtnRef}
                    className="recording-btn"
                    onClick={() => setSubMenu("zoom")}
                >
                    Zoom
                </button>
            </div>

            <div className="scrollable" ref={scrollableRef}>
                <div
                    className="recordings"
                    ref={cardsRef}
                    onTouchStart={(e) => removeScroll(e)}
                    onTouchMove={(e) => stopScreenRefreshOnScroll(e)}
                >
                    {visibleVideoCards}
                </div>

                <div ref={pageBtnRef} className="buttons">
                    <button ref={previousRef} onClick={() => previousPage()}><div className="arrow hidden"></div></button>
                    <p>Page {currentPage} of {lastPage}</p>
                    <button ref={nextRef} onClick={() => nextPage()}><div className="arrow reverse-arrow"></div></button>
                </div>

                <div ref={zoomPadRef} className="recordings-zoom-pad right">
                    <ZoomPad videoRef={videoRef} containerRef={containerRef} />
                </div>
            </div>
        </div>
    )
}

export default Recording