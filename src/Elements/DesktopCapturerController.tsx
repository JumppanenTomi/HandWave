import {useContext, useEffect, useRef, useState} from "react";
import {ipcRenderer} from "electron";
import os from "os";
import {MinimalViewContext, NotificationManagerContext, RecordedTimeContext, RecordingContext} from "@/App";

/**
 * Controls the desktop capturer functionality.
 *
 * @param {HTMLVideoElement | null} videoRef - The reference to the video element.
 *
 * @return {Object} - An object containing the following properties:
 *   - videoRef: HTMLVideoElement | null - The reference to the video element.
 *   - sources: Electron.DesktopCapturerSource[] - The available desktop capturer sources.
 *   - toggleRecording: () => void - Toggles the recording state.
 *   - changeSource: (sourceId: string) => void - Changes the source of the video element.
 *   - recording: boolean | undefined - The current recording state.
 */
export default function DesktopCapturerController(videoRef: HTMLVideoElement | null) {
    const isMac = os.platform() === "darwin";
    const {notificationManager} = useContext(NotificationManagerContext)
    const {setMinimalView} = useContext(MinimalViewContext)
    const {setRecordedTime} = useContext(RecordedTimeContext)


    const {reportError, reportSuccess} = notificationManager();
    const {recording} = useContext(RecordingContext);
    const [sources, setSources] = useState<Electron.DesktopCapturerSource[]>([]);
    const [sourceId, setSourceId] = useState<string>(
        localStorage.getItem("sourceId") || ""
    );
    const recordingInterval = useRef<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    useEffect(() => {
        ipcRenderer.send("REQUEST_SOURCES");
        ipcRenderer.on("GET_SOURCES", (e, content) => {
            setSources(content);
            // Check if there are available sources
            if (sourceId === "") {
                // Set the first source to the video element
                const firstSource = content[0];
                changeSource(firstSource.id);
            } else {
                // Set the source to the previously selected video element if navigated back to the home page
                changeSource(sourceId);
            }
        });
        ipcRenderer.on("refresh-sources", () => {
            ipcRenderer.send("REQUEST_SOURCES");
        });
        if (videoRef) {
            ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
                changeSource(sourceId)
            });
        }
        // Clean up the listeners when the component unmounts
        return () => {
            ipcRenderer.removeAllListeners("GET_SOURCES");
            ipcRenderer.removeAllListeners("refresh-sources");
            ipcRenderer.removeAllListeners("SET_SOURCE");
        };
    }, [videoRef]);

    // Change the source of the video element
    const changeSource = (sourceId: string) => {
        setSourceId(sourceId);
        localStorage.setItem("sourceId", sourceId);
        (navigator.mediaDevices as any)
            .getUserMedia({
                audio: isMac
                    ? false
                    : {
                        mandatory: {
                            chromeMediaSource: "desktop",
                        },
                    },
                video: {
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: sourceId,
                        minWidth: 1920,
                        maxWidth: 1920,
                        minHeight: 1080,
                        maxHeight: 1080,
                    },
                },
            } as unknown as MediaStreamConstraints)
            .then((stream: MediaStream) => {
                handleStream(stream, videoRef!);
                reportSuccess(undefined, "Video source changed", undefined, false, 1500)
            });
    };

    // Toggle the recording state
    const toggleRecording = () => {
        //sketchy way to make this but it works so don't touch :DDD
        if (recording === false) {
            setMinimalView(false)
            stopRecording();
        } else {
            console.log("2 "+recording)
            startRecording(sourceId);
        }
    };

    //Start recording the video
    const startRecording = (sourceId: string) => {
        stopAndClearMediaRecorder();
        // Start recorder timer
        setRecordedTime(0);
        //@ts-ignore
        recordingInterval.current = setInterval(() => {
            setRecordedTime((prevTime) => prevTime + 1);
        }, 1000);

        if (videoRef && videoRef.srcObject instanceof MediaStream) {
            const constraints = {
                audio: isMac
                    ? false
                    : {
                        mandatory: {
                            chromeMediaSource: "desktop",
                        },
                    },
                video: {
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: sourceId,
                        minWidth: 1920,
                        maxWidth: 1920,
                        minHeight: 1080,
                        maxHeight: 1080,
                    },
                },
            };

            // Get the audio stream from the microphone
            const getMicStream = () =>
                navigator.mediaDevices.getUserMedia({audio: true, video: false});

            // Get the video stream from the screen
            const getWindowStream = () =>
                navigator.mediaDevices.getUserMedia(constraints as unknown as MediaStreamConstraints);

            Promise.allSettled([getWindowStream(), getMicStream()])
                .then(([windowResult, micResult]) => {
                    if (
                        windowResult.status === "fulfilled" &&
                        micResult.status === "fulfilled"
                    ) {
                        const windowStream = windowResult.value;
                        const micStream = micResult.value;

                        console.log("micstream", micStream.getAudioTracks());
                        // Combine the video and mic streams
                        const combinedStream = new MediaStream();
                        windowStream
                            .getTracks()
                            .forEach((track) => combinedStream.addTrack(track));
                        micStream
                            .getAudioTracks()
                            .forEach((track) => combinedStream.addTrack(track));

                        const options = {
                            mimeType: "video/webm; codecs=vp9",
                        };

                        mediaRecorderRef.current = new MediaRecorder(
                            combinedStream,
                            options
                        );
                        mediaRecorderRef.current.ondataavailable =
                            handleStreamDataAvailable;
                        mediaRecorderRef.current.onstop = handleStreamEnded;

                        mediaRecorderRef.current.start();
                        console.log("Started recording");
                        reportSuccess(undefined, "Started recording", undefined, false, 1500)
                        mediaRecorderRef.current.onerror = (event) => {
                            reportError("Couldn't start screen capture", event.toString(), undefined, true, 999999999)
                            console.log("Error: ", event);
                        };
                    } else {
                        if ("reason" in windowResult) {
                            reportError("Couldn't start screen capture", windowResult.reason.toString(), undefined, true, 999999999)
                            console.log("Error: ", windowResult.reason);
                        }
                        if ("reason" in micResult) {
                            reportError("Couldn't start screen capture", micResult.reason.toString(), undefined, true, 999999999)
                            console.log("Error: ", micResult.reason);
                        }
                    }
                })
                .catch((error) => {
                    reportError("Couldn't start screen capture", error.toString(), undefined, true, 999999999)
                    console.error("Error getting streams:", error);
                });
        }
    };

    // Stop recording the video
    const stopRecording = () => {
        stopAndClearMediaRecorder();
        if (recordingInterval.current !== null) {
            clearInterval(recordingInterval.current);
        }
        reportSuccess(undefined, "Stopped recording", undefined, false, 1500)
        console.log("Stopped recording");
    };

    const stopAndClearMediaRecorder = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }
    };

    // Send the recorded video to the main process
    const handleStreamDataAvailable = async (e: BlobEvent) => {
        try {
            const data = await e.data.arrayBuffer();
            // Send the chunk data to the main process
            ipcRenderer.send("stream-chunk-received", new Uint8Array(data));
        } catch (error) {
            console.error("Error in handleStreamDataAvailable:", error);
        }
    };

    // Save the recorded video to the file system
    const handleStreamEnded = async () => {
        ipcRenderer.send("recording-stopped");
    };

    function handleStream(stream: MediaStream, video: HTMLVideoElement) {
        video.srcObject = stream;
        video.muted = true;
        video.onloadedmetadata = () => video.play();
    }

    useEffect(() => {
        if (recording !== undefined) {
            toggleRecording()
        }
    }, [recording]);

    return {
        videoRef,
        sources,
        toggleRecording,
        changeSource,
        recording
    }
}