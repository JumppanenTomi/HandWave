import React, {useContext, useRef} from "react";
import {RecordingContext} from "@/App";

/**
 * Retrieves the captured desktop element and corresponding video reference.
 *
 * @returns {Object} An object containing the desktop element and video reference.
 *                  - element: The captured desktop element.
 *                  - videoRef: The reference to the video element.
 */
export default function DesktopCapturer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const {recording} = useContext(RecordingContext)

    const element = (
        <div
            className={`video`}
            style={{
                width: '100%',
                height: 'min-content',
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                className={`video ${recording && "recording"}`}
                style={{width: '100%', objectFit: "cover", borderRadius: 5, border: "2px solid transparent"}}
            />
        </div>
    )

    return {
        element,
        videoRef
    }
}