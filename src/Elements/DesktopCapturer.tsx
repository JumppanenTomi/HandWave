import React, {useContext, useRef} from "react";
import {RecordingContext} from "@/App";

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