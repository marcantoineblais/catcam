"use client"

import React from "react"


const RecordingList = ({ recordings, setVideoSource, containerRef }: { recordings: any[]|null, setVideoSource: Function, containerRef: React.MutableRefObject<HTMLDivElement|null> }) => {

    const [activeVideoIndex, setActiveVideoIndex] = React.useState<number|null>(null)
    const [currentPage, setCurrentPage] = React.useState<number>(1)
    const [lastPage, setLastPage] = React.useState<number>(1)
    const cardsRef = React.useRef<HTMLDivElement|null>(null)
    const nextPageRef = React.useRef<HTMLImageElement|null>(null)
    const previousPageRef = React.useRef<HTMLImageElement|null>(null)


    // Resize cards when resizing window
    React.useEffect(() => {
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
    }, [containerRef, cardsRef])

    React.useEffect(() => {
        if (!recordings)
            return

        setLastPage(Math.ceil(recordings.length / 12))
    }, [recordings])

    React.useEffect(() => {
        window.dispatchEvent(new Event('resize'))
    }, [recordings, currentPage])

    const stopScreenRefreshOnScroll = (e: React.TouchEvent) => {
        const target = e.currentTarget
        const scroll = target.scrollTop

        if (scroll !== 0)
            e.stopPropagation()
    }
    
    const removeScroll = (e: React.TouchEvent) => {
        const cards = cardsRef.current

        if (!cards)
            return

        const start = e.touches[0].clientY
        const scrollHeight = cards.scrollHeight
        const height = cards.clientHeight

        const stopScroll = (e: TouchEvent) => {
            const position = e.touches[0].clientY
            const cardsScroll = cards.scrollTop

            if (cardsScroll <= 0 && start - position <= 0)
                cards.classList.add("overflow-hidden")
            else if (scrollHeight - cardsScroll <= height && start - position >= 0)
                cards.classList.add("overflow-hidden")
            else
                cards.classList.remove("overflow-hidden")

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

    const nextPage = () => {
        const cards = cardsRef.current
        const nextPage = nextPageRef.current
        const previousPage = previousPageRef.current

        if (!cards || !nextPage || !previousPage)
            return

        if (currentPage < lastPage) {
            cards.scrollTo(0, 0)
            setCurrentPage(currentPage + 1)
        }
        
        previousPage.classList.remove("invisible")
        if (currentPage + 1 === lastPage)
            nextPage.classList.add("invisible")
        else
            nextPage.classList.remove("invisible")
    }

    const previousPage = () => {
        const cards = cardsRef.current
        const previousPage = previousPageRef.current
        const nextPage = nextPageRef.current

        if (!cards || !previousPage || !nextPage)
            return

        if (currentPage > 1) {
            cards.scrollTo(0, 0)
            setCurrentPage(currentPage - 1)
        }
        
        nextPage.classList.remove("invisible")
        if (currentPage - 1 === 1)
            previousPage.classList.add("invisible")
        else
            previousPage.classList.remove("invisible")
    }

    function renderCards() {
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
            const activeStyle = i + startIndex === activeVideoIndex ? "cursor-default brightness-50" : "cursor-pointer hover:text-gray-500 hover:brightness-75"

            return (
                <div
                    className={`h-fit mb-3 flex flex-col rounded bg-gray-50 shadow-lg overflow-hidden duration-200 ${activeStyle}`}
                    key={key++}
                    onClick={() => videoOnClick(v, i + startIndex)}
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
        
        return cards
    }

    return (
        <div className="h-full w-full flex flex-col items-center">
            <div className="absolute w-full h-8 -translate-y-8">
                <img src="Unfold.svg" alt="upward arrow" className="w-full h-full object-contain duration-200"/>
            </div>
            <div
                className="w-full flex justify-between flex-wrap flex-grow overflow-y-auto scroll-smooth"
                ref={cardsRef}
                onTouchStart={(e) => removeScroll(e)}
                onTouchMove={(e) => stopScreenRefreshOnScroll(e)}
            >
                { renderCards() }
            </div>
            <div className="w-full py-31 flex justify-between items-center">
                <img ref={previousPageRef} src="Arrow.svg" alt="arrow pointing left" onClick={() => previousPage()} className="h-12 rotate-180 cursor-pointer invisible" />
                <p>Page {currentPage} of { lastPage }</p>
                <img ref={nextPageRef} src="Arrow.svg" alt="arrow pointing right" onClick={() => nextPage()} className="h-12 cursor-pointer" />
            </div>
        </div>
    )
}

export default RecordingList