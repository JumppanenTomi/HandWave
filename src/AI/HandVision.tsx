import {DrawingUtils, FilesetResolver, GestureRecognizer, GestureRecognizerResult,} from "@mediapipe/tasks-vision";
import {Dispatch, SetStateAction} from "react";
import {GestureData} from "@/types/GestureData";
import {IndexFinger} from "@/types/IndexFinger";
import {Thumb} from "@/types/Thumb";

let gestureRecognizer: GestureRecognizer;

export default function Ai(
    video: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
    setGestureData: Dispatch<SetStateAction<GestureData[] | undefined>>,
    setIndexFinger: Dispatch<SetStateAction<IndexFinger[] | undefined>>,
    setThumb: Dispatch<SetStateAction<Thumb[] | undefined>>,
) {
    let overlay: boolean

    const createGestureRecognizer = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "src/tasks/hagrid_dataset_512_1000.task",
                delegate: "GPU",
            },
            numHands: 2,
            runningMode: "VIDEO",
        });
        return;
    };


    function setOverlay(value: boolean) {
        overlay = value
    }

    const canvasCtx = canvasElement.getContext("2d");

    let lastVideoTime = -1;
    let results: GestureRecognizerResult;

    const predictWebcam = async () => {
        const nowInMs = Date.now();
        if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            results = gestureRecognizer.recognizeForVideo(video, nowInMs);
        }
        if (canvasCtx) {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            const drawingUtils = new DrawingUtils(canvasCtx);
            if (results.landmarks) {
                for (const landmarks of results.landmarks) {
                    if (overlay) {
                        drawingUtils.drawConnectors(
                            landmarks,
                            GestureRecognizer.HAND_CONNECTIONS,
                            {
                                color: "#009dff",
                                lineWidth: 1,
                            }
                        );
                        canvasCtx.restore();
                    }
                    setIndexFinger([landmarks[8]]);
                    setThumb([landmarks[4]]);
                }
            }
            if (results.gestures.length > 0) {
                const tempArray = results.gestures.map((gesture, index) => {
                    const category = gesture[0].categoryName;
                    const confidence = parseFloat(String(gesture[0].score * 100));
                    const hand = results.handedness[index][0].displayName;
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

            window.requestAnimationFrame(predictWebcam);
        }
    };

    return {
        createGestureRecognizer,
        predictWebcam,
        setOverlay
    };
}