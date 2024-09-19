"use client"

import { faArrowsLeftRightToLine, faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function OrientationWarning() {
    const [isMobile, setIsMobile] = React.useState<boolean>(false);
    const [orientation, setOrientation] = React.useState<string>("");

    React.useEffect(() => {
        setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    }, [])

    React.useEffect(() => {
        if (!isMobile)
            return;

        const onOrientationChange = () => {
            const orientation = screen.orientation.type;
            setOrientation(orientation);
        }

        window.addEventListener("orientationchange", onOrientationChange);
        
        return () => {
            window.removeEventListener("orientationchange", onOrientationChange);
        }
    }, [isMobile])

    return (
        <div className="hidden h-full landscape:flex landscape:lg:hidden justify-center items-end">
            <div className="py-1.5 flex items-center gap-1.5">
                { 
                    isMobile ? (
                        <>
                            <span>Rotate device for more options</span>
                            <FontAwesomeIcon icon={orientation === "landscape-primary" ? faRotateRight : faRotateLeft} />
                        </>
                    ) : (
                        <>
                            <span>Resize window for more options</span>
                            <FontAwesomeIcon icon={faArrowsLeftRightToLine} className="h-5"/>
                        </>
                    )
                }
            </div>
        </div>
    )
}