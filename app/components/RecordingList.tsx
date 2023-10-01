"use client"

import React from "react"


const RecordingList = ({
    recordings, pageSize, setVideoSource, containerRef, recordingsListRef, manageTouchMove, foldRecordingsList
}: {
    recordings: any[]|null,
    pageSize: number,
    setVideoSource: Function,
    containerRef: React.MutableRefObject<HTMLDivElement|null>,
    recordingsListRef: React.MutableRefObject<HTMLDivElement|null>,
    manageTouchMove: Function,
    foldRecordingsList: Function 
}) => {

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
            const availableWidth = currentWidth - (rowSize * 8)
            const width = (availableWidth / rowSize) + "px"
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

        setLastPage(Math.ceil(recordings.length / pageSize))
    }, [recordings, pageSize])

    React.useEffect(() => {
        const nextPage = nextPageRef.current
        const previousPage = previousPageRef.current

        if (!nextPage || !previousPage)
            return

        nextPage.classList.remove("invisible")
        previousPage.classList.remove("invisible")
        
        if (currentPage === 1)
        previousPage.classList.add("invisible")
        if (currentPage === lastPage)
            nextPage.classList.add("invisible")
    }, [currentPage, lastPage])
    
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
    }

    // create the cards to display the recordings list
    function renderRecordingsList() {
        const container = containerRef.current
        
        if (!recordings || !container)
            return
        
        const currentWidth = container.clientWidth
        const rowSize = currentWidth > 720 ? 3 : 2
        const availableWidth = currentWidth - (rowSize * 8)
        const width = (availableWidth / rowSize)
        const height = (width / 16) * 9
        const nbOfrecordingsList = recordings.length
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize > nbOfrecordingsList ? nbOfrecordingsList : startIndex + pageSize
        let key = 0
        
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
                    <img src={v.thumbnail} alt="camera snapshot" className="object-fill" style={{ width: width + "px", height: height + "px" }}/>
                    <p className="text-center py-1 text-sm" style={{ width: width + "px" }}>{date + ", " + time}</p>
                </div>
            )
        })

        return recordingsList
    }

    return (
        <div className="h-full w-full flex flex-col items-center">
            <div
                className="w-full h-full flex justify-start content-start gap-2 flex-wrap flex-grow scroll-smooth overflow-y-scroll duration-500"
                ref={recordingsListRef}
                onTouchStart={(e) => manageTouchMove(e)}
            >
                { renderRecordingsList() }
            </div>
            <div className="w-full py-31 flex justify-between items-center">
                <div ref={previousPageRef} onClick={() => previousPage()} className="px-3 py-1.5 flex items-center rotate-180 cursor-pointer invisible">
                    <svg className="h-9 w-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                        <path fill="currentColor" d="M480.27,243.82,288.05,123.31a4.78,4.78,0,0,0-7.32,4v241a4.78,4.78,0,0,0,7.32,4.05L480.27,251.92A4.78,4.78,0,0,0,480.27,243.82Z"/>
                        <path fill="currentColor" d="M287.55,298.87H39.66a4.06,4.06,0,0,1-4.11-4v-94a4.06,4.06,0,0,1,4.11-4H287.55Z"/>
                    </svg>
                </div>
                <p>Page {currentPage} of { lastPage }</p>
                <div ref={nextPageRef} onClick={() => nextPage()} className="px-3 py-1.5 flex items-center cursor-pointer">
                    <svg className="h-9 w-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                        <path fill="currentColor" d="M480.27,243.82,288.05,123.31a4.78,4.78,0,0,0-7.32,4v241a4.78,4.78,0,0,0,7.32,4.05L480.27,251.92A4.78,4.78,0,0,0,480.27,243.82Z"/>
                        <path fill="currentColor" d="M287.55,298.87H39.66a4.06,4.06,0,0,1-4.11-4v-94a4.06,4.06,0,0,1,4.11-4H287.55Z"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default RecordingList