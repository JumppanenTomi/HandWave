import {GestureRecognizer, FilesetResolver, DrawingUtils, GestureRecognizerResult} from "@mediapipe/tasks-vision";
import {Dispatch, SetStateAction} from "react";
import {GestureData} from "@/types/GestureData";

let gestureRecognizer: GestureRecognizer
export default function HandVision(video: HTMLVideoElement, canvasElement: HTMLCanvasElement, setGestureData: Dispatch<SetStateAction<GestureData[] | undefined>>, setError: Dispatch<SetStateAction<string | undefined>>) {
    const canvasCtx = canvasElement.getContext("2d")
    let lastVideoTime = -1
    let results: GestureRecognizerResult | undefined = undefined

    const createGestureRecognizer = async () => {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm")
        gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "src/models/hagrid_dataset_512_1000.task",
                delegate: "GPU"
            },
            numHands: 2,
            runningMode: "VIDEO"
        })
        return
    }

    const predictWebcam = async () => {
        const nowInMs = Date.now()
        if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime
            results = gestureRecognizer.recognizeForVideo(video, nowInMs)
        }

        if (canvasCtx && results) {
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
                            lineWidth: 1
                        }
                    )
                }
            }
            canvasCtx.restore();
            const tempArray = results.gestures.map((gesture, index) => {
                const category = gesture[0].categoryName;
                const confidence = parseFloat(String(gesture[0].score * 100));
                const hand = results!.handedness[index][0].displayName;
                return {category, confidence, hand};
            });
            if (tempArray.length > 0) {
                setGestureData(tempArray as unknown as GestureData[]);
            } else {
                setGestureData(undefined);
            }
            window.requestAnimationFrame(predictWebcam);
        }
    }

    return {
        createGestureRecognizer,
        predictWebcam
    }
}

