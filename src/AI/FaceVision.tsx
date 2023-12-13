import {DrawingUtils, FaceLandmarker, FilesetResolver, NormalizedLandmark} from "@mediapipe/tasks-vision";
import {Dispatch, SetStateAction} from "react";

/**
 * Instance of the FaceLandmarker class that is responsible for detecting facial landmarks
 *
 * @class
 */
let faceLandmarker: FaceLandmarker;
/**
 * Performs face detection and gaze tracking using MediaPipe and a webcam video feed.
 * @param {HTMLVideoElement} video - The video element that provides the webcam feed.
 * @param {HTMLCanvasElement} canvasElement - The canvas element used to display the video feed and overlays.
 * @param {Dispatch<SetStateAction<boolean>>} setGazeState - A function to update the state of gaze tracking.
 * @returns {object} - An object containing the following methods:
 *   - createFaceMeshRecognizer: A method that creates a face mesh recognizer.
 *   - predictWebcam: A method that performs face detection and gaze tracking on the webcam feed.
 *   - setOverlay: A method that sets the overlay option for displaying landmarks on the canvas.
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