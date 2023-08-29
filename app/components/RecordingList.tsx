import { useEffect, useRef, useState } from "react"
import ZoomPad from "./ZoomPad"
import { Container } from "postcss"


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
            const width = (currentWidth / rowSize) - 8 + "px"
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
        const container = containerRef.current
        
        if (!recordings || !container)
            return
        
        const currentWidth = container.clientWidth
        const rowSize = currentWidth > 720 ? 3 : 2
        const nbOfCards = recordings.length
        const startIndex = (currentPage - 1) * 12
        const endIndex = startIndex + 12 > nbOfCards ? nbOfCards : startIndex + 12
        let key = 1
        
        function videoOnClick(video: any, index: number) {
            setActiveVideoIndex(index)
            setVideoSource(video.videoSource)
        }

        const cards = recordings.slice(startIndex, endIndex).map((v, i) => {
            const time = v.time.toTimeString().split(" ")[0]
            const date = v.time.toDateString().split(" ").slice(1, 4).join("-")
            const activeStyle = i + startIndex === activeVideoIndex ? "bg-sky-700 text-neutral-50 cursor-default grayscale" : "bg-neutral-50 cursor-pointer hover:text-neutral-500 hover:blur-sm"

            return (
                <div
                    className={`mb-3 flex flex-col justify-center items-center rounded shadow-lg overflow-hidden duration-200 ${activeStyle}`}
                    key={key++}
                    onClick={() => videoOnClick(v, i)}
                >
                    <img src={v.thumbnail} alt="camera snapshot" className="w-full h-full object-fill" />
                    <p className="w-full text-center py-1 text-sm">{date + ", " + time}</p>
                </div>
            )
        })

        while (cards.length % rowSize !== 0) {
            cards.push(
                <div key={key++}>
                    <div></div>
                    <div></div>
                </div>
            )
        }

        setRenderedVideoCards(cards)
        setLastPage(Math.ceil(cards.length / 12))
    }, [recordings, setVideoSource, activeVideoIndex, currentPage])

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


    return (
        <div className="h-full w-full flex flex-col items-center">
            <div
                className="flex justify-between flex-wrap flex-grow overflow-y-auto"
                ref={cardsRef}
                // onTouchStart={(e) => removeScroll(e)}
                // onTouchMove={(e) => stopScreenRefreshOnScroll(e)}
            >
                { renderedVideoCards }
            </div>
            <div ref={pageBtnRef} className="py-3 flex justify-between items-center">
                <button onClick={() => previousPage()}></button>
                <p>Page {currentPage} of {lastPage}</p>
                <button onClick={() => nextPage()}></button>
            </div>
        </div>
    )
}

export default RecordingList