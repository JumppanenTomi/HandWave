import {GestureRecognizer, FilesetResolver, DrawingUtils, GestureRecognizerResult} from "@mediapipe/tasks-vision";
import {Dispatch, SetStateAction} from "react";
import {GestureData} from "./types/GestureData";

let gestureRecognizer: GestureRecognizer
let webcamRunning = false

export default function Ai(video: HTMLVideoElement, canvasElement: HTMLCanvasElement, setGestureData: Dispatch<SetStateAction<GestureData[]>>, setBtnText: Dispatch<SetStateAction<string>>, setError: Dispatch<SetStateAction<string | undefined>>) {

    const createGestureRecognizer = async () => {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm")
        gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "src/models/gesture_recognizer.task",
                delegate: "GPU"
            },
            numHands: 2,
            runningMode: "VIDEO"
        })
    }

    const canvasCtx = canvasElement.getContext("2d")

    const enableCam = () => {
        if (!gestureRecognizer) {
            setError("Wait for recognizer to load")
            return
        }
        if (webcamRunning === true) {
            webcamRunning = false
            setBtnText("Start analyzing")
        } else {
            webcamRunning = true
            setBtnText("Stop analyzing")
        }
        navigator.mediaDevices.getUserMedia({video: true}).then((stream) => video.srcObject = stream)
    };

    let lastVideoTime = -1
    let results: GestureRecognizerResult = undefined

    const predictWebcam = async () => {
        const nowInMs = Date.now()
        if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime
            results = gestureRecognizer.recognizeForVideo(video, nowInMs)
        }

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
        const drawingUtils = new DrawingUtils(canvasCtx)

        if (results.landmarks) {
            for (const landmarks of results.landmarks) {
                drawingUtils.drawConnectors(
                    landmarks,
                    GestureRecognizer.HAND_CONNECTIONS,
                    {
                        color: "#009dff",
                        lineWidth: 2
                    }
                )
                drawingUtils.drawLandmarks(landmarks, {
                    color: "#68ff00",
                    lineWidth: 1
                })
            }
        }
        canvasCtx.restore();
        if (results.gestures.length > 0) {
            const tempArray = results.gestures.map((gesture, index) => {
                const category = gesture[0].categoryName;
                const confidence = parseFloat(String(gesture[0].score * 100));
                const hand = results.handednesses[index][0].displayName;
                return {category, confidence, hand};
            });

            if (tempArray.length > 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setGestureData(tempArray);
            } else {
                setGestureData(undefined);
            }
        } else {
            setGestureData(undefined);
        }

        if (webcamRunning === true) {
            window.requestAnimationFrame(predictWebcam);
        }
    };

    return {
        createGestureRecognizer,
        predictWebcam,
        enableCam
    }
}

