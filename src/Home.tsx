import {Col, Container, Row, Button, Navbar, Nav, DropdownButton, Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import React, {MutableRefObject, useContext, useEffect, useRef, useState} from "react";
import {GestureData} from "./types/GestureData";
import Ai from "./Ai";
import {Link} from "react-router-dom";
import {ipcRenderer} from "electron";
import {ActionsDataContext} from "@/App";
import ExecuteActions from "@/executeActions";

const constraints = {
    video: true
};

function Home() {
    const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);

    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(null);
    const {actionData, setActionData} = useContext(ActionsDataContext)
    const [gestureData, setGestureData] = useState<GestureData[]>()
    const [error, setError] = useState<string | undefined>()
    const [ai, setAi] = useState<any>()
    const [sources, setSources] = useState<Electron.DesktopCapturerSource[]>([]);

    useEffect(() => {
        if (canvasRef !== null && webCamRef.current != null && canvasRef.current != null) {
            setAi(Ai(webCamRef.current, canvasRef.current, setGestureData, setError))
        }
    }, [canvasRef]);

    useEffect(() => {
        if (ai) {
            ai.createGestureRecognizer().then(() => {
                ai.enableCam()
            })
            if (webCamRef.current !== null) {
                navigator.mediaDevices.getUserMedia(constraints).then(() => {
                    webCamRef.current.addEventListener("loadeddata", ai.predictWebcam);
                });
            }
        }
    }, [ai]);

    useEffect(() => {
        const currentTime = Date.now();
        if (gestureData && actionData && (!lastExecutionTime || currentTime - lastExecutionTime >= 3000)) {
            // Execute the actions only if the last execution was more than 3 seconds ago
            ExecuteActions(gestureData, actionData);
            setLastExecutionTime(currentTime);
        }
    }, [gestureData, actionData, lastExecutionTime]);

    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error]);

    useEffect(() => {
        ipcRenderer.send('REQUEST_SOURCES');
        ipcRenderer.on("GET_SOURCES", (e, content) => {
            setSources(content);
            // Check if there are available sources
            if (content.length > 0) {
                // Set the first source to the video element
                const firstSource = content[0];
                changeSource(firstSource);
            }
        });
        if (videoRef.current) {
            ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
                console.log(event);
                try {
                    (navigator.mediaDevices as any)
                        .getUserMedia({
                            audio: false,
                            video: {
                                mandatory: {
                                    chromeMediaSource: "desktop",
                                    chromeMediaSourceId: sourceId,
                                    minWidth: 1280,
                                    maxWidth: 1280,
                                    minHeight: 720,
                                    maxHeight: 720,
                                },
                            },
                        } as MediaStreamConstraints)
                        .then((stream: MediaStream) => {
                            handleStream(stream, videoRef.current!);
                        });
                } catch (e) {
                    handleError(e);
                }
            });
        }
    }, [videoRef.current]);

    function handleStream(stream: MediaStream, video: HTMLVideoElement) {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => video.play();
    }

    function handleError(e: any) {
        console.log(e);
    }

    const changeSource = (source: Electron.DesktopCapturerSource) => {
        console.log("Selected source:", source);
        (navigator.mediaDevices as any)
            .getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: source.id,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720,
                    },
                },
            } as MediaStreamConstraints)
            .then((stream: MediaStream) => {
                handleStream(stream, videoRef.current!);
            });
    };

    return (
        <Container>
            <Navbar expand={"lg"}>
                <Container>
                    <Nav>
                        <Navbar.Text><h1>GesturePresentation</h1></Navbar.Text>
                    </Nav>
                    <Nav.Link><Link to={"/settings"}><Button><FontAwesomeIcon
                        icon={faGear}/></Button></Link></Nav.Link>
                </Container>
            </Navbar>
            <Row>
                <Col xs={6}>
                    <div style={{position: "relative", width: "100%", height: "min-content"}}>
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
                                zIndex: 1
                            }}
                        />
                    </div>
                    {gestureData &&
                        gestureData.map((item, index) => (
                            <p key={index}>{item.category} {item.confidence.toFixed(2)} {item.hand}</p>
                        ))
                    }
                </Col>
                <Col>
                    <video ref={videoRef} autoPlay style={{width: "100%", objectFit: "cover", borderRadius: 5}}/>
                    <DropdownButton title="Select Desktop Source" id="dropdown-basic-button">
                        {sources.map((source, index) => (
                            <Dropdown.Item key={index}
                                           onClick={() => changeSource(source)}>{source.name}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Col>
            </Row>
        </Container>
    )

}

export default Home;
