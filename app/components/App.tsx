import { useEffect, useRef, useState, Fragment } from "react";
import Navbar from "./Navbar";
import VideoPlayer from "./VideoPlayer";
import Recording from "./Recording";
import ZoomPad from "./ZoomPad";
import requestJSON from "../util/requestJSON";
import "../style/App.scss"

const App = () => {

    const [page, setPage] = useState(null)
    const [renderedPage, setRenderedPage] = useState(null)
    const [liveFeed, setLiveFeed] = useState(null)
    const [recordingsURL, setRecordingsURL] = useState(null)
    const [videoSource, setVideoSource] = useState(null)
    const [recordings, setRecordings] = useState(null)
    const [user, setUser] = useState(null)
    const [refreshTimer] = useState([])
    const containerRef = useRef()
    const videoRef = useRef()

    // If logged in, use the user object to make API call to server
    // Create the livestream and the recordings URL
    useEffect(() => {
        if (user === null) {
            setPage("login")
            setLiveFeed(null)
            setRecordingsURL(null)
            setVideoSource(null)
            setRecordings(null)
            return
        }

        const getVideosURL = async () => {
            const baseURL = 'https://catcam.source.marchome.xyz'
            const key = user.auth_token
            const groupKey = user.ke
            const monitors = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))
            let videoFeed = monitors[0].mid
            const ext = 's.m3u8'
            while (!videoFeed) {
                videoFeed = await requestJSON([baseURL, key, "monitor", groupKey].join("/"))
            }

            setLiveFeed({ url: [baseURL, key, "hls", groupKey, videoFeed, ext].join('/'), format: "hls" })
            setRecordingsURL([baseURL, key, "videos", groupKey, videoFeed].join('/'))
        }

        getVideosURL()
    }, [user])

    // Make fetch requests for recording list
    // Build video objects with list
    useEffect(() => {
        if (!recordingsURL) {
            return
        }

        const createVideosObject = (videos, snapshots) => {
            return videos.map(v => {
                const videoTime = new Date(v.time)
                let thumbnail = null

                for (let i = 1; i < snapshots.length; i++) {
                    const upperTime = new Date(snapshots[i - 1].time)
                    const lowerTime = new Date(snapshots[i].time)

                    if (videoTime >= lowerTime && videoTime <= upperTime) {
                        const filename = snapshots[i - 1].filename
                        thumbnail = filename.split("T")[0] + "/" + filename
                    }
                }

                return ({
                    videoSource: recordingsURL + "/" + v.href.split("/")[5],
                    time: videoTime,
                    thumbnail: (recordingsURL + "/" + thumbnail).replace("videos", "timelapse")
                })
            }).filter(t => !t.thumbnail.includes("null"))
        }

        const getRecordings = async () => {
            const snapshots = await requestJSON(recordingsURL.replace("videos", "timelapse"))
            let videos = await requestJSON(recordingsURL)
            while (!videos.ok) {
                videos = await requestJSON(recordingsURL)
            }

            const videosObject = createVideosObject(videos.videos, snapshots)
            setRecordings(videosObject)
        }

        getRecordings()
    }, [recordingsURL])

//     useEffect(() => {
//         const renderLoginPage = () => {
//             if (page === "login") {
//                 return (
//                     <SignIn setUser={setUser} setPage={setPage} logoOnly={page === "login"} />
//                 )
//             }
//         }

//         // Render HLS VideoPlayer for livestreaming for recordings
//         const renderLivePage = () => {
//             if (page === "live" && liveFeed) {
//                 setVideoSource(liveFeed)
//                 return (
//                     <Fragment>
//                         <VideoPlayer
//                             videoSource={liveFeed}
//                             videoRef={videoRef}
//                         />
//                         <ZoomPad videoRef={videoRef} containerRef={containerRef} />
//                     </Fragment>
//                 )
//             }
//         }

//         const renderRecordingsPage = () => {
//             if (page === "recordings") {
//                 return (
//                     <Fragment>
//                         <VideoPlayer
//                             videoSource={videoSource}
//                             videoRef={videoRef}
//                         />
//                         <Recording
//                             recordings={recordings}
//                             setVideoSource={setVideoSource}
//                             containerRef={containerRef}
//                             videoRef={videoRef}
//                         />
//                     </Fragment>
//                 )
//             }
//         }

//         switch (page) {
//             case "login":
//                 setRenderedPage(renderLoginPage())
//                 break
//             case "live":
//                 setRenderedPage(renderLivePage())
//                 break
//             case "recordings":
//                 setRenderedPage(renderRecordingsPage())
//                 break
//             default:
//                 setRenderedPage(renderLoginPage())
//                 setPage("login")
//         }
//     }, [page, liveFeed, recordings, videoSource])

//     useEffect(() => {
//         const refreshPage = (e) => {
//             const body = document.getElementById("root")
//             const refreshIcon = document.getElementById("refresh-icon")
//             const start = e.touches[0].clientY

//             const clearListeners = () => {
//                 refreshTimer.forEach(t => clearTimeout(t))
//                 refreshTimer.splice(0, refreshTimer.length)
//                 window.removeEventListener("touchmove", scrollToRefresh)
//                 window.removeEventListener("touchend", refresh)
//                 body.style.transform = ""
//             }

//             const refresh = () => {
//                 clearListeners()
//                 window.location.reload()
//             }

//             const scrollToRefresh = (e) => {
//                 if (e.touches.length > 1) {
//                     clearListeners()
//                     return
//                 }

//                 const position = e.touches[0].clientY
//                 const scrollValue = ((position - start) / body.clientHeight) * 100

//                 if (scrollValue > 25) {
//                     body.style.transform = `translateY(12%)`
//                     refreshIcon.classList.add("animate")
//                     if (refreshTimer.length === 0) {
//                         refreshTimer.push(setTimeout(() => {
//                             window.removeEventListener("touchend", clearListeners)
//                             window.addEventListener("touchend", refresh)
//                             refreshTimer.forEach(t => clearTimeout(t))
//                             refreshTimer.splice(0, refreshTimer.length)
//                         }, 350))
//                     }
//                 } else {
//                     refreshIcon.classList.remove("animate")
//                     body.style.transform = ""

//                     refreshTimer.forEach(t => clearTimeout(t))
//                     refreshTimer.splice(0, refreshTimer.length)
//                     window.removeEventListener("touchend", refresh)
//                     window.addEventListener("touchend", clearListeners)
//                 }
//             }

//             window.addEventListener("touchend", clearListeners)
//             window.addEventListener("touchmove", scrollToRefresh)
//         }

//         window.addEventListener("touchstart", refreshPage)

//         return () => {
//             window.removeEventListener("touchstart", refreshPage)
//         }
//     }, [refreshTimer])

//     const removeScroll = (e) => {
//         const container = containerRef.current
//         const start = e.touches[0].clientY
//         const scrollHeight = container.scrollHeight
//         const height = container.clientHeight

//         const stopScroll = (e) => {
//             const position = e.touches[0].clientY
//             const containerScroll = container.scrollTop

//             if (containerScroll <= 0 && start - position <= 0)
//                 container.classList.add("no-scroll")
//             else if (scrollHeight - containerScroll <= height && start - position >= 0)
//                 container.classList.add("no-scroll")
//             else
//                 container.classList.remove("no-scroll")

//             if (containerScroll > 0)
//                 e.stopPropagation()
//         }

//         const removeListeners = () => {
//             container.classList.remove("no-scroll")
//             container.removeEventListener("touchmove", stopScroll)
//             container.removeEventListener("touchend", removeListeners)

//         }

//         if (container.scrollTop > 0)
//             e.stopPropagation()

//         container.addEventListener("touchmove", stopScroll)
//         container.addEventListener("touchend", removeListeners)
//     }

//     return (
//         <Fragment>
//             <Navbar setUser={setUser} setPage={setPage} logoOnly={page === "login"} />
//             <div className="container" ref={containerRef} onTouchStart={(e) => removeScroll(e)}>
//                 {renderedPage}
//             </div>
//         </Fragment>
//     )
// }

// export default App;
