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
            foldRecordingsList()
        }

        resize()
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [containerRef, recordingsListRef, foldRecordingsList])

    // Get the number of pages
    React.useEffect(() => {
        if (!recordings)
            return

        setLastPage(Math.ceil(recordings.length / 12))
    }, [recordings])

    // Force resize event when changing page or section
    React.useEffect(() => {
        window.dispatchEvent(new Event('resize'))
    }, [recordings, currentPage])
    
    // Make sure that the good action triggers when manipulation the recordings list
    // Cannot refresh page from menu if the menu is not scrolled up
    // menu will open before scrolling
    // menu will close only when scroll up (and disable refresh during this time)
    const manageTouchMove = (e: React.TouchEvent) => {
        const recordingsList = recordingsListRef.current

        if (!recordingsList)
            return

        const start = e.touches[0].clientY
        const scrollHeight = recordingsList.scrollHeight
        const recordingsListScroll = recordingsList.scrollTop
        const height = recordingsList.clientHeight
        let canRefresh = true
        
        const stopScroll = (e: TouchEvent) => {
            const position = e.touches[0].clientY

            if (!canRefresh)
                e.stopPropagation()
            
            if (start - position >= 0 && scrollHeight - recordingsListScroll >= height) {
                if (unfoldRecordingsList()) {
                    canRefresh = false
                }
            } else if (recordingsListScroll <= 0 && start - position <= 0) {     
                if (foldRecordingsList()) {
                    canRefresh = false
                }
            }

            if (recordingsList.scrollTop > 0 || start - position > 0) {
                canRefresh = false           
            }
        }
               
        const removeListeners = () => {
            recordingsList.classList.remove("overflow-hidden")
            recordingsList.classList.add("overflow-y-auto")
            recordingsList.removeEventListener("touchmove", stopScroll)
            recordingsList.removeEventListener("touchend", removeListeners)
        }

        recordingsList.addEventListener("touchmove", stopScroll)
        recordingsList.addEventListener("touchend", removeListeners)
    }

    // Change pages
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

    // create the cards to display the recordings list
    function renderRecordingsList() {
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
                    className={`h-fit mb-3 flex flex-col rounded bg-gray-50 shadow overflow-hidden duration-200 dark:bg-zinc-800 dark:shadow-zinc-50/10 ${activeStyle}`}
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
        <div className="h-full w-full flex flex-col items-center">
            <div
                className="w-full h-full flex justify-between flex-wrap flex-grow overflow-y-auto scroll-smooth duration-500"
                ref={recordingsListRef}
                onTouchStart={(e) => manageTouchMove(e)}
            >
                { renderRecordingsList() }
            </div>
            <div className="w-full py-31 flex justify-between items-center">
                <div ref={previousPageRef} onClick={() => previousPage()} className="h-12 w-16 px-3 flex items-center rotate-180 cursor-pointer invisible">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                        <path fill="currentColor" d="M480.27,243.82,288.05,123.31a4.78,4.78,0,0,0-7.32,4v241a4.78,4.78,0,0,0,7.32,4.05L480.27,251.92A4.78,4.78,0,0,0,480.27,243.82Z"/>
                        <path fill="currentColor" d="M287.55,298.87H39.66a4.06,4.06,0,0,1-4.11-4v-94a4.06,4.06,0,0,1,4.11-4H287.55Z"/>
                    </svg>
                </div>
                <p>Page {currentPage} of { lastPage }</p>
                <div ref={nextPageRef} onClick={() => nextPage()} className="h-12 w-16 px-3 flex items-center cursor-pointer">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                        <path fill="currentColor" d="M480.27,243.82,288.05,123.31a4.78,4.78,0,0,0-7.32,4v241a4.78,4.78,0,0,0,7.32,4.05L480.27,251.92A4.78,4.78,0,0,0,480.27,243.82Z"/>
                        <path fill="currentColor" d="M287.55,298.87H39.66a4.06,4.06,0,0,1-4.11-4v-94a4.06,4.06,0,0,1,4.11-4H287.55Z"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default RecordingList