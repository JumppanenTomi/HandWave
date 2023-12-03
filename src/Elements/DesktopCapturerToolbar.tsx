import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Col, Dropdown, DropdownButton, Row} from "react-bootstrap";
import {ipcRenderer} from "electron";
import os from "os";
import {RecordingContext} from "@/App";

export default function DesktopCapturerToolbar(videoRef: HTMLVideoElement | null) {
    const isMac = os.platform() === "darwin";

    const [recordedTime, setRecordedTime] = useState(0);
    const {recording, setRecording} = useContext(RecordingContext);
    const [selectedSourceHighlighted, setSelectedSourceHighlighted] = useState<Electron.DesktopCapturerSource | null>(null);
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
                console.log(event);
                setSourceId(sourceId);
                localStorage.setItem("sourceId", sourceId);
                try {
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
                        });
                } catch (e) {
                    console.log(e);
                }
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
            });
    };

    // Toggle the recording state
    const toggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording(sourceId);
        }
        // Toggle the recording state
        setRecording!(!recording);
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
                        mediaRecorderRef.current.onerror = (event) => {
                            console.log("Error: ", event);
                        };
                    } else {
                        if ("reason" in windowResult) {
                            console.log("Error: ", windowResult.reason);
                        }
                        if ("reason" in micResult) {
                            console.log("Error: ", micResult.reason);
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error getting streams:", error);
                });
        }
    };

    // Stop recording the video
    const stopRecording = () => {
        stopAndClearMediaRecorder();
        //@ts-ignore
        clearInterval(recordingInterval.current);
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

    // Convert the timer to a time format
    const formatTime = (timeInSeconds: any) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
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


    const element = (
        <Row>
            <Col>
                <DropdownButton
                    style={{
                        position: "relative",
                        display: "inline-block",
                        height: "min-content",
                    }}
                    title="Select Source"
                    id="dropdown-basic-button"
                >
                    {sources.map((source, index) => (
                        <Dropdown.Item
                            key={index}
                            onClick={() => {
                                changeSource(source.id);
                                setSelectedSourceHighlighted(source);
                            }}
                            style={
                                source === selectedSourceHighlighted
                                    ? {backgroundColor: "#e8e9ea"}
                                    : {}
                            }
                        >
                            {source.name}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </Col>
            <Col>
                <Button
                    variant={recording ? "danger" : "success"}
                    onClick={toggleRecording}
                >
                    {recording
                        ? `Stop Recording (${formatTime(recordedTime)})`
                        : "Start Recording"}
                </Button>
            </Col>
        </Row>
    )

    return {
        element,
        videoRef,
        recording,
        setRecording
    }
}