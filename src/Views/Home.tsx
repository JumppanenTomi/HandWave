import {Col, Row} from "react-bootstrap";
import React, {MutableRefObject, useContext, useEffect, useRef, useState,} from "react";
import {ipcRenderer} from "electron";
import {ActionsDataContext} from "@/App";
import os from "os";
import HandVision from "@/AI/HandVision";
import EnableWebcam from "@/AI/EnableWebcam";
import FaceDetection from "@/AI/FaceVision";
import {GestureData} from "@/types/GestureData";
import {IndexFinger} from "@/types/IndexFinger";
import ExecuteActions from "@/AI/executeActions";
import Webcam from "@/Elements/Webcam";
import DesktopCapturer from "@/Elements/DesktopCapturer";
import DesktopCapturerToolbar from "@/Elements/DesktopCapturerToolbar";

const constraints = {
    video: true,
}

function Home() {
    const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null)
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null)

    const desktopCapturer = DesktopCapturer()
    const desktopCapturerToolbar = DesktopCapturerToolbar(desktopCapturer.videoRef.current)

    const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(null)
    const {gestureData: actionData} = useContext(ActionsDataContext)
    const [gestureData, setGestureData] = useState<GestureData[]>()
    const [gestureAi, setGestureAi] = useState<any>()
    const [gazeAi, setGazeAi] = useState<any>()
    const [gazeState, setGazeState] = useState<boolean>(false)
    const [indexFinger, setIndexFinger] = useState<IndexFinger[] | undefined>()

    const isMac = os.platform() === "darwin"

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
            )

            setGazeAi(
                FaceDetection(webCamRef.current, canvasRef.current, setGazeState)
            )
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
                })
            }
        }
        if (gazeAi) {
            gazeAi.createFaceMeshRecognizer()
            if (webCamRef.current !== null) {
                const webcamCurrent = webCamRef.current
                navigator.mediaDevices.getUserMedia(constraints).then(() => {
                    webcamCurrent.addEventListener("loadeddata", gazeAi.predictWebcam)
                })
            }
        }
    }, [gestureAi, gazeAi])

    useEffect(() => {
        const currentTime = Date.now()
        if (
            gestureData &&
            actionData &&
            gazeState &&
            (!lastExecutionTime || currentTime - lastExecutionTime >= 3000)
        ) {
            // Execute the actions only if the last execution was more than 3 seconds ago
            ExecuteActions(gestureData, actionData).then(() =>
                console.log("Actions executed")
            )
            setLastExecutionTime(currentTime)
        }
    }, [gestureData, actionData, lastExecutionTime])

    useEffect(() => {
        if (indexFinger && gestureData && gestureData?.[0]?.category === "two_up") {
            ipcRenderer.invoke("mouseClick")
        }
    }, [gestureData])

    useEffect(() => {
        if (indexFinger && gestureData && gestureData?.[0]?.category === "peace") {
            ipcRenderer.invoke("moveMouse", indexFinger[0])
        }
    }, [gestureData])

    return (
        <div style={{padding: 0}}>
            <Row>
                <Col>
                    <Webcam
                        recording={desktopCapturerToolbar.recording}
                        canvasRef={canvasRef}
                        webCamRef={webCamRef}
                    />
                </Col>
                <Col>
                    {desktopCapturer.element}
                    {desktopCapturerToolbar.element}
                </Col>
            </Row>
        </div>
    )
}

export default Home
