import { useEffect, useRef, useState } from "react"
import ZoomPad from "./ZoomPad"


const RecordingList = ({ recordings, setVideoSource, containerRef }: { recordings: any[]|null, setVideoSource: Function, containerRef: React.MutableRefObject<HTMLDivElement|null> }) => {

    const [renderedVideoCards, setRenderedVideoCards] = useState<any[]|null>(null)
    const [activeVideoIndex, setActiveVideoIndex] = useState<number|null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [lastPage, setLastPage] = useState<number>(1)
    const cardsRef = useRef<HTMLDivElement|null>(null)
    const pageBtnRef = useRef<HTMLDivElement|null>(null)
    const nextRef = useRef<HTMLButtonElement|null>()
    const previousRef = useRef<HTMLButtonElement|null>()


    // Resize cards when resizing window
    useEffect(() => {
        const resize = () => {
            const container = containerRef.current
            const cards = cardsRef.current
            if (!container || !cards)
                return

            const currentWidth = container.clientWidth
            const rowSize = currentWidth > 720 ? 3 : 2
            const width = (currentWidth / rowSize) - 20 + "px"
            const height = (parseInt(width) / 16) * 9 + "px"

            for (let i = 0; i < cards.children.length; i++) {
                const card: any = cards.children[i]

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
    })

    useEffect(() => {
        if (!recordings)
            return
        
        function videoOnClick(video: any, index: number) {
            setActiveVideoIndex(index)
            setVideoSource(video.videoSource)
        }

        const cards = recordings.map((v, i) => {
            const time = v.time.toTimeString().split(" ")[0]
            const date = v.time.toDateString().split(" ").slice(1, 4).join("-")

            return (
                <div
                    className={`thumbnail`}
                    key={i}
                    onClick={() => videoOnClick(v, i)}
                >
                    <img src={v.thumbnail} alt="camera snapshot" />
                    <p>{date + ", " + time}</p>
                </div>
            )
        })

        setRenderedVideoCards(cards)
        setLastPage(Math.ceil(cards.length / 12))
    }, [recordings, setVideoSource])

    // const stopScreenRefreshOnScroll = (e) => {
    //     const target = e.currentTarget
    //     const scroll = target.scrollTop

    //     if (scroll !== 0)
    //         e.stopPropagation()
    // }

    const nextPage = () => {
        const cards = cardsRef.current
        if (!cards)
            return

        if (currentPage < lastPage) {
            cards.scrollTo(0, 0)
            setCurrentPage(currentPage + 1)
        }
    }

    const previousPage = () => {
        const cards = cardsRef.current
        if (!cards)
            return

        if (currentPage > 1) {
            cards.scrollTo(0, 0)
            setCurrentPage(currentPage - 1)
        }
    }

    // const removeScroll = (e) => {
    //     const cards = cardsRef.current
    //     const start = e.touches[0].clientY
    //     const scrollHeight = cards.scrollHeight
    //     const height = cards.clientHeight

    //     const stopScroll = (e) => {
    //         const position = e.touches[0].clientY
    //         const cardsScroll = cards.scrollTop

    //         if (cardsScroll <= 0 && start - position <= 0)
    //             cards.classList.add("no-scroll")
    //         else if (scrollHeight - cardsScroll <= height && start - position >= 0)
    //             cards.classList.add("no-scroll")
    //         else
    //             cards.classList.remove("no-scroll")

    //         if (cardsScroll > 0)
    //             e.stopPropagation()
    //     }

    //     if (cards.scrollTop > 0)
    //         e.stopPropagation()

    //     const removeListeners = () => {
    //         cards.classList.remove("no-scroll")
    //         cards.removeEventListener("touchmove", stopScroll)
    //         cards.removeEventListener("touchend", removeListeners)

    //     }

    //     cards.addEventListener("touchmove", stopScroll)
    //     cards.addEventListener("touchend", removeListeners)
    // }

    
    function renderCards() {
        const container = containerRef.current
        if (!renderedVideoCards || !container)
            return

        const currentWidth = container.clientWidth
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

        return cards
    }

    return (
        <div className="h-full w-full flex flex-col items-center">
            <div
                className="flex justify-between gap-1 flex-wrap flex-grow overflow-y-auto"
                ref={cardsRef}
                // onTouchStart={(e) => removeScroll(e)}
                // onTouchMove={(e) => stopScreenRefreshOnScroll(e)}
            >
                { renderCards() }
            </div>
            <div ref={pageBtnRef} className="buttons">
                <button onClick={() => previousPage()}><div className="arrow hidden"></div></button>
                <p>Page {currentPage} of {lastPage}</p>
                <button onClick={() => nextPage()}><div className="arrow reverse-arrow"></div></button>
            </div>
        </div>
    )
}

export default RecordingList