import {DrawingUtils, FaceLandmarker, FilesetResolver, NormalizedLandmark} from "@mediapipe/tasks-vision";
import {Dispatch, SetStateAction} from "react";

/**
 * Utility class for detecting and tracking facial landmarks in an image.
 *
 * @class
 * @memberof module:facialRecognition
 */
let faceLandmarker: FaceLandmarker;
/**
 * Creates a face detection and tracking system for webcam video.
 *
 * @param {HTMLVideoElement} video - The video element to capture webcam feed.
 * @param {HTMLCanvasElement} canvasElement - The HTML canvas element for rendering the video feed and overlays.
 * @param {Dispatch<SetStateAction<boolean>>} setGazeState - A state setter function for the gaze state.
 *
 * @returns {Object} - An object containing the following methods:
 *   - createFaceMeshRecognizer: A method to create a face mesh recognizer.
 *   - predictWebcam: A method to start predicting webcam feed and updating the gaze state.
 *   - setOverlay: A method to toggle the overlay option.
 *
 * @async
 * @returns {Promise<void>}
 */
export default function FaceDetection(
    video: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
    setGazeState: Dispatch<SetStateAction<boolean>>
) {
    let overlay: boolean

    /**
     * Creates a face mesh recognizer.
     * @async
     * @returns {Promise<void>}
     */
    const createFaceMeshRecognizer = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "GPU"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        });
        return;
    };

    const canvasCtx = canvasElement.getContext("2d");

    let lastVideoTime = -1;
    let results: any = undefined;
    const drawingUtils = new DrawingUtils(canvasCtx!);

    function isUserLookingAtCamera(tessellationLandmarks: NormalizedLandmark[]): boolean {
        // Calculate the centroid of the tessellation landmarks
        const centroidX = tessellationLandmarks.reduce((sum, point) => sum + point.x, 0) / tessellationLandmarks.length;
        const centroidY = tessellationLandmarks.reduce((sum, point) => sum + point.y, 0) / tessellationLandmarks.length;

        // You might need to adjust these thresholds based on your specific use case
        const horizontalThreshold = 0.05; // Adjust as needed
        const verticalThreshold = 0.05; // Adjust as needed

        // Check if the centroid is within a certain range to consider the user looking at the camera
        const isLookingAtCamera =
            centroidX > 0.5 - horizontalThreshold &&
            centroidX < 0.5 + horizontalThreshold &&
            centroidY > 0.5 - verticalThreshold &&
            centroidY < 0.5 + verticalThreshold;

        return isLookingAtCamera;
    }

    function setOverlay(value: boolean) {
        overlay = value
    }

    async function predictWebcam() {
        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            results = faceLandmarker.detectForVideo(video, startTimeMs);
        }
        if (results.faceLandmarks) {
            for (const landmarks of results.faceLandmarks) {
                if (overlay) {
                    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, {
                        color: "rgba(68,68,68,0.29)",
                        lineWidth: 1,
                    });
                } else if (canvasCtx != null) {
                    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                }
                setGazeState(isUserLookingAtCamera(landmarks))
            }
        }

        window.requestAnimationFrame(predictWebcam);
    }

    return {
        createFaceMeshRecognizer,
        predictWebcam,
        setOverlay
    };
}