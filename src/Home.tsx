import {Button, Col, Container, Dropdown, DropdownButton, Nav, Navbar, Row,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import React, {MutableRefObject, useContext, useEffect, useRef, useState,} from "react";
import {GestureData} from "./types/GestureData";
import {Link} from "react-router-dom";
import {ipcRenderer} from "electron";
import {ActionsDataContext} from "@/App";
import ExecuteActions from "@/executeActions";
import os from "os";
import {IndexFinger} from "./types/IndexFinger";
import HandVision from "@/AI/HandVision";
import EnableWebcam from "@/AI/EnableWebcam";
import FaceDetection from "@/AI/FaceVision";

const constraints = {
    video: true,
};

function Home() {
    const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);

    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(
        null
    );
    const {gestureData: actionData} = useContext(ActionsDataContext);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const recordingInterval = useRef<number | null>(null);

    const [gestureData, setGestureData] = useState<GestureData[]>();
    const [error, setError] = useState<string | undefined>();
    const [gestureAi, setGestureAi] = useState<any>();
    const [gazeAi, setGazeAi] = useState<any>();
    const [sources, setSources] = useState<Electron.DesktopCapturerSource[]>([]);
    const [sourceId, setSourceId] = useState<string>(
        localStorage.getItem("sourceId") || ""
    );
    const [selectedSourceHighlighted, setSelectedSourceHighlighted] =
        useState(null);
    const [recording, setRecording] = useState(false);
    const [indexFinger, setIndexFinger] = useState<IndexFinger[] | undefined>();
    const [recordedTime, setRecordedTime] = useState(0);

    const isMac = os.platform() === "darwin";

    useEffect(() => {
        if (
            canvasRef !== null &&
            webCamRef.current != null &&
            canvasRef.current != null
        ) {
            setGestureAi(
                HandVision(
                    webCamRef.current,
                    canvasRef.current,
                    setGestureData,
                    setIndexFinger
                )
            );

            setGazeAi(
                FaceDetection(
                    webCamRef.current,
                    canvasRef.current
                )
            );
        }
    }, [canvasRef]);

    useEffect(() => {
        if (webCamRef.current) {
            EnableWebcam(webCamRef.current)
        }
        if (gestureAi) {
            gestureAi.createGestureRecognizer()
            if (webCamRef.current !== null) {
                const webcamCurrent = webCamRef.current
                navigator.mediaDevices.getUserMedia(constraints).then(() => {
                    webcamCurrent.addEventListener("loadeddata", gestureAi.predictWebcam);
                });
            }
        }
        if (gazeAi) {
            gazeAi.createFaceMeshRecognizer()
            if (webCamRef.current !== null) {
                const webcamCurrent = webCamRef.current
                navigator.mediaDevices.getUserMedia(constraints).then(() => {
                    webcamCurrent.addEventListener("loadeddata", gazeAi.predictWebcam);
                });
            }
        }
    }, [gestureAi, gazeAi]);

    useEffect(() => {
        const currentTime = Date.now();
        if (
            gestureData &&
            actionData &&
            (!lastExecutionTime || currentTime - lastExecutionTime >= 3000)
        ) {
            // Execute the actions only if the last execution was more than 3 seconds ago
            ExecuteActions(gestureData, actionData);
            setLastExecutionTime(currentTime);
        }
    }, [gestureData, actionData, lastExecutionTime]);

    useEffect(() => {
        if (indexFinger && gestureData && gestureData?.[0]?.category === "two_up") {
            ipcRenderer.invoke("mouseClick");
        }
    }, [gestureData]);

    useEffect(() => {
        if (indexFinger && gestureData && gestureData?.[0]?.category === "peace") {
            ipcRenderer.invoke("moveMouse", indexFinger[0]);
        }
    }, [gestureData]);

    useEffect(() => {
        if (error) {
            alert(error);
        }
    }, [error]);

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
        if (videoRef.current) {
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
                            handleStream(stream, videoRef.current!);
                        });
                } catch (e) {
                    handleError(e);
                }
            });
        }
        // Clean up the listeners when the component unmounts
        return () => {
            ipcRenderer.removeAllListeners("GET_SOURCES");
            ipcRenderer.removeAllListeners("refresh-sources");
            ipcRenderer.removeAllListeners("SET_SOURCE");
        };
    }, [videoRef.current]);

    function handleStream(stream: MediaStream, video: HTMLVideoElement) {
        video.srcObject = stream;
        video.muted = true;
        video.onloadedmetadata = (e) => video.play();
    }

    function handleError(e: any) {
        console.log(e);
    }

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
                handleStream(stream, videoRef.current!);
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
        setRecording(!recording);
    };

    //Start recording the video
    const startRecording = (sourceId: string) => {
        stopAndClearMediaRecorder();
        // Start recorder timer
        setRecordedTime(0);
        recordingInterval.current = setInterval(() => {
            setRecordedTime((prevTime) => prevTime + 1);
        }, 1000);

        if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
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

    return (
        <Container>
            <Navbar expand={"lg"}>
                <Container style={{padding: 0}}>
                    <Nav>
                        <Navbar.Text>
                            <img
                                src="/src/assets/handwave-logo.svg"
                                alt="logo"
                                style={{width: "16rem"}}
                            />
                        </Navbar.Text>
                    </Nav>
                    <Nav.Link>
                        <Link to={"/settings"}>
                            <Button>
                                <FontAwesomeIcon icon={faGear}/>
                            </Button>
                        </Link>
                    </Nav.Link>
                </Container>
            </Navbar>
            <Row>
                <Col xs={6}>
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "min-content",
                        }}
                    >
                        <video
                            autoPlay
                            playsInline
                            ref={webCamRef}
                            style={{width: "100%", objectFit: "cover", borderRadius: 5}}
                        />
                        <canvas
                            ref={canvasRef}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                            }}
                        />
                    </div>
                    {gestureData &&
                        gestureData.map((item, index) => item && (
                            <p key={index}>
                                {item.category} {item.confidence.toFixed(2)} {item.hand}
                            </p>
                        ))}
                </Col>
                <Col>
                    <Col>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "min-content",
                            }}
                        >
                            <video
                                ref={videoRef}
                                autoPlay
                                className={`video ${recording ? "recording" : ""}`}
                                style={{
                                    width: "100%", objectFit: "cover", borderRadius: 5, border: "2px solid transparent"
                                }}
                            />
                        </div>
                    </Col>
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
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
