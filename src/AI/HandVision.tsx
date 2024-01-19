import {DrawingUtils, FilesetResolver, GestureRecognizer, GestureRecognizerResult,} from "@mediapipe/tasks-vision";
import {Dispatch, SetStateAction} from "react";
import {GestureData} from "@/types/GestureData";
import {IndexFinger} from "@/types/IndexFinger";
import {Thumb} from "@/types/Thumb";

/**
 * Represents a gesture recognizer.
 *
 * @class
 */
let gestureRecognizer: GestureRecognizer;

/**
 * Initialize AI object for gesture recognition
 *
 * @param {HTMLVideoElement} video - The video element to be used for gesture recognition
 * @param {HTMLCanvasElement} canvasElement - The canvas element on which to draw the hand landmarks
 * @param {Dispatch<SetStateAction<GestureData[] | undefined>>} setGestureData - Function to set the gesture data state
 * @param {Dispatch<SetStateAction<IndexFinger[] | undefined>>} setIndexFinger - Function to set the index finger data state
 * @param {Dispatch<SetStateAction<Thumb[] | undefined>>} setThumb - Function to set the thumb data state
 * @returns {Object} - Object containing the following methods:
 *      - createGestureRecognizer: Function to create the gesture recognizer
 *      - predictWebcam: Function to perform gesture recognition on the video frames
 *      - setOverlay: Function to set the overlay flag for drawing hand landmarks
 */
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
                /**TODO: Replace this to use local version instead of web version**/
                modelAssetPath: "https://raw.githubusercontent.com/JumppanenTomi/presentation-tool-with-hand-gestures/master/src/assets/tasks/hagrid.task",
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