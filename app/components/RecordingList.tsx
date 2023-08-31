"use client"

import React from "react"


const RecordingList = (
    { recordings, setVideoSource, containerRef, recordingsListRef, unfoldRecordingsList, foldRecordingsList }:
    {
        recordings: any[]|null,
        setVideoSource: Function,
        containerRef: React.MutableRefObject<HTMLDivElement|null>,
        recordingsListRef: React.MutableRefObject<HTMLDivElement|null>,
        unfoldRecordingsList: Function,
        foldRecordingsList: Function }
) => {

    const [activeVideoIndex, setActiveVideoIndex] = React.useState<number|null>(null)
    const [currentPage, setCurrentPage] = React.useState<number>(1)
    const [lastPage, setLastPage] = React.useState<number>(1)
    const nextPageRef = React.useRef<HTMLImageElement|null>(null)
    const previousPageRef = React.useRef<HTMLImageElement|null>(null)


    // Resize recordingsList when resizing window
    React.useEffect(() => {
        const resize = () => {
            const container = containerRef.current
            const recordingsList = recordingsListRef.current
            if (!container || !recordingsList)
                return

            const currentWidth = container.clientWidth
            const rowSize = currentWidth > 720 ? 3 : 2
            const width = (currentWidth / rowSize) - 8 + "px"
            const height = (parseInt(width) / 16) * 9 + "px"

            for (let i = 0; i < recordingsList.children.length; i++) {
                const card: any = recordingsList.children[i]

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
    }, [containerRef, recordingsListRef])

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
        const recordingsList = recordingsListRef.current

        if (!recordingsList)
            return

        const start = e.touches[0].clientY
        const scrollHeight = recordingsList.scrollHeight
        const height = recordingsList.clientHeight

        const stopScroll = (e: TouchEvent) => {
            const position = e.touches[0].clientY
            const recordingsListScroll = recordingsList.scrollTop

            if (recordingsListScroll <= 0 && start - position <= 0) {
                recordingsList.classList.add("overflow-hidden")
                foldRecordingsList()
            } else if (scrollHeight - recordingsListScroll <= height && start - position >= 0)
                recordingsList.classList.add("overflow-hidden")
            else if (recordingsListScroll <= 0 && start - position > 0) {
                e.stopPropagation()
                unfoldRecordingsList()
            } 

            if (recordingsListScroll > 0) {
                e.stopPropagation()
            }
        }

        if (recordingsList.scrollTop > 0)
            e.stopPropagation()

        const removeListeners = () => {
            recordingsList.classList.remove("overflow-hidden")
            window.removeEventListener("touchmove", stopScroll)
            window.removeEventListener("touchend", removeListeners)
        }

        window.addEventListener("touchmove", stopScroll)
        window.addEventListener("touchend", removeListeners)
    }

    const nextPage = () => {
        const recordingsList = recordingsListRef.current
        const nextPage = nextPageRef.current
        const previousPage = previousPageRef.current

        if (!recordingsList || !nextPage || !previousPage)
            return

        if (currentPage < lastPage) {
            recordingsList.scrollTo(0, 0)
            setCurrentPage(currentPage + 1)
        }
        
        previousPage.classList.remove("invisible")
        if (currentPage + 1 === lastPage)
            nextPage.classList.add("invisible")
        else
            nextPage.classList.remove("invisible")
    }

    const previousPage = () => {
        const recordingsList = recordingsListRef.current
        const previousPage = previousPageRef.current
        const nextPage = nextPageRef.current

        if (!recordingsList || !previousPage || !nextPage)
            return

        if (currentPage > 1) {
            recordingsList.scrollTo(0, 0)
            setCurrentPage(currentPage - 1)
        }
        
        nextPage.classList.remove("invisible")
        if (currentPage - 1 === 1)
            previousPage.classList.add("invisible")
        else
            previousPage.classList.remove("invisible")
    }

    function renderrecordingsList() {
        const container = containerRef.current
        
        if (!recordings || !container)
            return
        
        const currentWidth = container.clientWidth
        const rowSize = currentWidth > 720 ? 3 : 2
        const nbOfrecordingsList = recordings.length
        const startIndex = (currentPage - 1) * 12
        const endIndex = startIndex + 12 > nbOfrecordingsList ? nbOfrecordingsList : startIndex + 12
        let key = 1
        
        function videoOnClick(video: any, index: number) {
            setActiveVideoIndex(index)
            setVideoSource(video.videoSource)
            foldRecordingsList()
        }

        const recordingsList = recordings.slice(startIndex, endIndex).map((v, i) => {
            const time = v.time.toTimeString().split(" ")[0]
            const date = v.time.toDateString().split(" ").slice(1, 4).join("-")
            const activeStyle = i + startIndex === activeVideoIndex ? "cursor-default brightness-50" : "cursor-pointer hover:text-gray-500 hover:brightness-75"

            return (
                <div
                    className={`h-fit mb-3 flex flex-col rounded bg-gray-50 shadow-lg overflow-hidden duration-1000 ${activeStyle}`}
                    key={key++}
                    onClick={() => videoOnClick(v, i + startIndex)}
                >
                    <img src={v.thumbnail} alt="camera snapshot" className="w-full h-full object-fill" />
                    <p className="w-full text-center py-1 text-sm">{date + ", " + time}</p>
                </div>
            )
        })

        while (recordingsList.length % rowSize !== 0) {
            recordingsList.push(
                <div key={key++}>
                    <div></div>
                    <div></div>
                </div>
            )
        }
        
        return recordingsList
    }

    return (
        <div className="h-full w-full flex flex-col items-center bg-inherit">
            <div
                className="w-full h-full flex justify-between flex-wrap flex-grow overflow-y-auto scroll-smooth duration-500"
                ref={recordingsListRef}
                onTouchStart={(e) => removeScroll(e)}
                onTouchMove={(e) => stopScreenRefreshOnScroll(e)}
            >
                { renderrecordingsList() }
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