import {
    FilesetResolver,
    DrawingUtils,
    FaceLandmarker, NormalizedLandmark
} from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker;
export default function FaceDetection(
    video: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
) {
    const createFaceMeshRecognizer = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "CPU"
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
    const videoWidth = 480;

    function isUserLookingAtCamera(tessellationLandmarks: NormalizedLandmark[]): boolean {
        // Calculate the centroid of the tessellation landmarks
        const centroidX = tessellationLandmarks.reduce((sum, point) => sum + point.x, 0) / tessellationLandmarks.length;
        const centroidY = tessellationLandmarks.reduce((sum, point) => sum + point.y, 0) / tessellationLandmarks.length;

        // You might need to adjust these thresholds based on your specific use case
        const horizontalThreshold = 0.09; // Adjust as needed
        const verticalThreshold = 0.1; // Adjust as needed

        // Check if the centroid is within a certain range to consider the user looking at the camera
        const isLookingAtCamera =
            centroidX > 0.5 - horizontalThreshold &&
            centroidX < 0.5 + horizontalThreshold &&
            centroidY > 0.5 - verticalThreshold &&
            centroidY < 0.5 + verticalThreshold;

        return isLookingAtCamera;
    }

    async function predictWebcam() {
        const radio = video.videoHeight / video.videoWidth;
        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            results = faceLandmarker.detectForVideo(video, startTimeMs);
        }
        if (results.faceLandmarks) {
            for (const landmarks of results.faceLandmarks) {
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, {
                    color: "rgba(200,87,255,0.29)"
                });
                const isLookingAtCamera = isUserLookingAtCamera(landmarks);
                console.log("User is looking at the camera:", isLookingAtCamera);
            }
        }

        window.requestAnimationFrame(predictWebcam);
    }

    return {
        createFaceMeshRecognizer,
        predictWebcam
    };
}