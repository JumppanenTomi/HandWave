"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_vision_1 = require("@mediapipe/tasks-vision");
let gestureRecognizer;
let webcamRunning = false;
function Ai(video, canvasElement, setGestureData, setBtnText, setError) {
    const createGestureRecognizer = async () => {
        const vision = await tasks_vision_1.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
        gestureRecognizer = await tasks_vision_1.GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "src/models/rps.task",
                delegate: "GPU"
            },
            numHands: 2,
            runningMode: "VIDEO"
        });
    };
    const canvasCtx = canvasElement.getContext("2d");
    const enableCam = () => {
        if (!gestureRecognizer) {
            setError("Wait for recognizer to load");
            return;
        }
        if (webcamRunning === true) {
            webcamRunning = false;
            setBtnText("Start analyzing");
        }
        else {
            webcamRunning = true;
            setBtnText("Stop analyzing");
        }
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => video.srcObject = stream);
    };
    let lastVideoTime = -1;
    let results = undefined;
    const predictWebcam = async () => {
        const nowInMs = Date.now();
        if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            results = gestureRecognizer.recognizeForVideo(video, nowInMs);
        }
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        const drawingUtils = new tasks_vision_1.DrawingUtils(canvasCtx);
        if (results.landmarks) {
            for (const landmarks of results.landmarks) {
                drawingUtils.drawConnectors(landmarks, tasks_vision_1.GestureRecognizer.HAND_CONNECTIONS, {
                    color: "#009dff",
                    lineWidth: 2
                });
                drawingUtils.drawLandmarks(landmarks, {
                    color: "#68ff00",
                    lineWidth: 1
                });
            }
        }
        canvasCtx.restore();
        if (results.gestures.length > 0) {
            const tempArray = results.gestures.map((gesture, index) => {
                const category = gesture[0].categoryName;
                const confidence = parseFloat(String(gesture[0].score * 100));
                const hand = results.handednesses[index][0].displayName;
                return { category, confidence, hand };
            });
            if (tempArray.length > 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setGestureData(tempArray);
            }
            else {
                setGestureData(undefined);
            }
        }
        else {
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
    };
}
exports.default = Ai;
//# sourceMappingURL=Ai.js.map