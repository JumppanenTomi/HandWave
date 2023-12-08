import {Col, Row} from "react-bootstrap";
import React, {MutableRefObject, useContext, useEffect, useRef, useState,} from "react";
import {ipcRenderer} from "electron";
import {ActionsDataContext, FaceDetectionContext, MeshContext, MinimalViewContext} from "@/App";
import HandVision from "@/AI/HandVision";
import EnableWebcam from "@/AI/EnableWebcam";
import FaceDetection from "@/AI/FaceVision";
import {GestureData} from "@/types/GestureData";
import {IndexFinger} from "@/types/IndexFinger";
import Webcam from "@/Elements/Webcam";
import DesktopCapturer from "@/Elements/DesktopCapturer";
import DesktopCapturerToolbar from "@/Elements/DesktopCapturerToolbar";
import {Thumb} from "@/types/Thumb";
import ExecuteActions from "@/AI/executeActions";
import TopToolbar from "@/Elements/Actionbars/TopToolbar";
import Maintoolbar from "@/Elements/Actionbars/Maintoolbar";
import MinimalView from "@/Elements/Actionbars/MinimalView";
import TitleBar from "@/Elements/Actionbars/TopAppBar";
import SelectSourceModal from "@/Elements/Modals/SelectSourceModal";
import FaceDetectionSettingsModal from "@/Elements/Modals/FaceDetectionSettingsModal";
import "@/styles/primaryView.css"
import MacroModal from "@/Elements/Modals/MacroModal";

const constraints = {
    video: true,
}

function Home() {
    const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null)
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null)

    const desktopCapturer = DesktopCapturer()
    const desktopCapturerToolbar = DesktopCapturerToolbar(desktopCapturer.videoRef.current)

    const sourceModal = SelectSourceModal(desktopCapturerToolbar.sources, desktopCapturerToolbar.changeSource)
    const processingSetting = FaceDetectionSettingsModal()
    const macroModal = MacroModal()

    const {faceDetection} = useContext(FaceDetectionContext)
    const {mesh} = useContext(MeshContext)

    const {minimalView, setMinimalView} = useContext(MinimalViewContext)

    const {gestureData: actionData} = useContext(ActionsDataContext)
    const [gestureData, setGestureData] = useState<GestureData[]>()
    const [gestureAi, setGestureAi] = useState<any>()
    const [gazeAi, setGazeAi] = useState<any>()
    const [gazeState, setGazeState] = useState<boolean>(false)
    const [indexFinger, setIndexFinger] = useState<IndexFinger[] | undefined>()
    const [thumb, setThumb] = useState<Thumb[] | undefined>();
    const [executionTime, setExecutionTime] = useState<number | undefined>()

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
                    setIndexFinger,
                    setThumb,
                    mesh === "true"
                )
            );
            setGazeAi(
                FaceDetection(webCamRef.current, canvasRef.current, setGazeState, mesh === "true")
            );
        }
    }, [canvasRef, mesh, faceDetection]);

    useEffect(() => {
        if (webCamRef.current) {
            EnableWebcam(webCamRef.current);
        }
        if (gestureAi) {
            gestureAi.createGestureRecognizer();
            if (webCamRef.current !== null) {
                const webcamCurrent = webCamRef.current;
                navigator.mediaDevices.getUserMedia(constraints).then(() => {
                    webcamCurrent.addEventListener("loadeddata", gestureAi.predictWebcam);
                });
            }
        }
        if (gazeAi) {
            gazeAi.createFaceMeshRecognizer();
            if (webCamRef.current !== null) {
                const webcamCurrent = webCamRef.current;
                navigator.mediaDevices.getUserMedia(constraints).then(() => {
                    webcamCurrent.addEventListener("loadeddata", gazeAi.predictWebcam);
                });
            }
        }
    }, [gestureAi, gazeAi]);

    useEffect(() => {
        if (gestureData && actionData && (gazeState || faceDetection === "false")) {
            ExecuteActions(gestureData, actionData, executionTime, setExecutionTime).then(() =>
                console.log("Actions executed")
            );
        }
    }, [gestureData, actionData]);

    useEffect(() => {
        if (
            indexFinger &&
            thumb &&
            gestureData &&
            gestureData?.[0]?.category === "one"
        ) {
            ipcRenderer.invoke("mouseClick");
        }
    }, [gestureData]);

    useEffect(() => {
        if (
            indexFinger &&
            thumb &&
            gestureData &&
            gestureData?.[0]?.category === "three2"
        ) {
            ipcRenderer.invoke("moveMouse", indexFinger[0], thumb[0]);
        }
    }, [gestureData]);

    useEffect(() => {
        if (indexFinger && thumb && gestureData && gestureData[0]) {
            ipcRenderer.invoke(
                "dragMouse",
                indexFinger[0],
                thumb[0],
                gestureData[0].category
            );
        }
    }, [gestureData]);

    return (
        <>
            {minimalView && <MinimalView/>}
            <div className={"content"} style={minimalView ? {display: "none"} : undefined}>
                <TitleBar/>
                <TopToolbar/>
                <Row className={"video-container"}>
                    <Col>
                        <Webcam canvasRef={canvasRef} webCamRef={webCamRef}/>
                    </Col>
                    <Col>
                        {desktopCapturer.element}
                    </Col>
                </Row>
                <Maintoolbar sourceModal={sourceModal} processingSettingModal={processingSetting} macroModal={macroModal}/>
                {sourceModal.element}
                {processingSetting.element}
                {macroModal.element}
            </div>
        </>
    )
}

export default Home
