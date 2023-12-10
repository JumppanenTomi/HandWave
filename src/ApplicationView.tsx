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
import DesktopCapturerController from "@/Elements/DesktopCapturerController";
import {Thumb} from "@/types/Thumb";
import ExecuteActions from "@/AI/executeActions";
import TopToolbar from "@/Elements/Actionbars/TopToolbar";
import Maintoolbar from "@/Elements/Actionbars/Maintoolbar";
import MinimalView from "@/Elements/Actionbars/MinimalView";
import TitleBar from "@/Elements/Actionbars/TopAppBar";
import SelectSourceModal from "@/Elements/Modals/SelectSourceModal";
import FaceDetectionSettingsModal from "@/Elements/Modals/FaceDetectionSettingsModal";
import MacroModal from "@/Elements/Modals/MacroModal";

/**
 * Represents the constraints for a variable.
 *
 * @typedef {Object} VariableConstraints
 * @property {boolean} video - Indicates whether the variable should include video.
 */
const constraints = {
    video: true,
}

/**
 * Represents the ApplicationView component.
 *
 * @returns {React.Component} The rendered ApplicationView component.
 */
function ApplicationView() {
    const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null)
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null)

    const desktopCapturer = DesktopCapturer()
    const desktopCapturerToolbar = DesktopCapturerController(desktopCapturer.videoRef.current)

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
    const [tick, setTick] = useState(0);

    // Set up an interval to update the tick state every 0.5 second (to be able to click only every 0.5 second)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTick(tick => tick + 1);
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const configureAi = async () => {
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
                    )
                );
                setGazeAi(
                    FaceDetection(webCamRef.current, canvasRef.current, setGazeState)
                );
            }
        }
        configureAi().then(() => console.log("ai done"))
    }, [canvasRef]);

    useEffect(() => {
        if (gestureAi && gazeAi) {
            gestureAi.setOverlay(mesh)
            gazeAi.setOverlay(mesh)
        }
    }, [mesh]);

    useEffect(() => {
        const enableAiAndWebcam = async () => {
            if (webCamRef.current) {
                await EnableWebcam(webCamRef.current);
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
        }
        enableAiAndWebcam()
    }, [gestureAi, gazeAi]);

    useEffect(() => {
        if (gestureData && actionData && (gazeState || !faceDetection)) {
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
            gestureData?.[0]?.category === "one" &&
            tick > 1
        ) {
            ipcRenderer.invoke("mouseClick");
            setTick(0);
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
                <Maintoolbar sourceModal={sourceModal} processingSettingModal={processingSetting}
                             macroModal={macroModal}/>
                {!minimalView && (
                    <>
                        {sourceModal.element}
                        {processingSetting.element}
                        {macroModal.element}
                    </>
                )}
            </div>
        </>
    )
}

export default ApplicationView
