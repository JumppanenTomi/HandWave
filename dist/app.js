"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Ai_1 = __importDefault(require("./Ai"));
const react_bootstrap_1 = require("react-bootstrap");
const nut_js_1 = require("@nut-tree/nut-js");
const constraints = {
    video: true
};
function App() {
    const webCamRef = (0, react_1.useRef)(null);
    const canvasRef = (0, react_1.useRef)(null);
    const buttonRef = (0, react_1.useRef)(null);
    const [gestureData, setGestureData] = (0, react_1.useState)();
    const [btnText, setBtnText] = (0, react_1.useState)("Enable webcam");
    const [error, setError] = (0, react_1.useState)();
    const [ai, setAi] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        if (canvasRef !== null) {
            setAi((0, Ai_1.default)(webCamRef.current, canvasRef.current, setGestureData, setBtnText, setError));
        }
    }, [canvasRef]);
    (0, react_1.useEffect)(() => {
        if (ai) {
            ai.createGestureRecognizer();
            navigator.mediaDevices.getUserMedia(constraints).then(() => {
                webCamRef.current.addEventListener("loadeddata", ai.predictWebcam);
            });
        }
    }, [ai]);
    (0, react_1.useEffect)(() => {
        if (error) {
            alert(error);
        }
    }, [error]);
    (0, react_1.useEffect)(() => {
        if (gestureData && gestureData[0].category == "paper") {
            (async () => {
                await nut_js_1.keyboard.pressKey(nut_js_1.Key.Space);
                await nut_js_1.keyboard.releaseKey(nut_js_1.Key.Space);
            })();
        }
    }, [gestureData]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: { position: "relative" }, children: [(0, jsx_runtime_1.jsx)("video", { autoPlay: true, playsInline: true, ref: webCamRef, style: { width: "50%", height: "50%", objectFit: "cover" } }, void 0), (0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, style: { position: "absolute", top: 0, left: 0, width: "50%", height: "100%", zIndex: 1 } }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { ref: buttonRef, onClick: ai && ai.enableCam, children: btnText }, void 0), gestureData &&
                gestureData.map((item) => ((0, jsx_runtime_1.jsxs)("p", { children: [item.category, " ", item.confidence.toFixed(2), " ", item.hand] }, void 0)))] }, void 0));
}
exports.default = App;
//# sourceMappingURL=app.js.map