import {Col, Container, Row, Button, Navbar, Nav} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {GestureData} from "./types/GestureData";
import Ai from "./Ai";
import {Link} from "react-router-dom";
import arrayIndexAsValue from "./sharedUtilities/arrayIndexAsValue";

const constraints = {
    video: true
};

function Home() {
    const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);

    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);

    const [gestureData, setGestureData] = useState<GestureData[]>()
    const [error, setError] = useState<string | undefined>()
    const [ai, setAi] = useState<any>()

    useEffect(() => {
        if (canvasRef !== null) {
            setAi(Ai(webCamRef.current, canvasRef.current, setGestureData, setError))
        }
    }, [canvasRef]);

    useEffect(() => {
        if (ai) {
            ai.createGestureRecognizer().then(() => {
                ai.enableCam()
            })
            navigator.mediaDevices.getUserMedia(constraints).then(() => {
                webCamRef.current.addEventListener("loadeddata", ai.predictWebcam);
            });
        }
    }, [ai]);

    useEffect(() => {
        if (gestureData && gestureData[0].category == "paper") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            window.myapi.pressKey('space')
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            window.myapi.releaseKey('space')
        }
    }, [gestureData]);

    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error]);

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
                </Col>
            </Row>
        </Container>
    )

}

export default Home;
