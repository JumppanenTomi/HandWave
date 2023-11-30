import React, {useRef} from "react";

export default function DesktopCapturer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

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
                className={"video recording"}
                style={{width: '100%', objectFit: "cover", borderRadius: 5, border: "2px solid transparent"}}
            />
        </div>
    )

    return {
        element,
        videoRef
    }
}