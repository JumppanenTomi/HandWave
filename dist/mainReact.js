"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const app_1 = __importDefault(require("./app"));
require("bootstrap/dist/css/bootstrap.min.css");
const root = (0, client_1.createRoot)(document.body);
root.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(app_1.default, {}, void 0) }, void 0));
//# sourceMappingURL=mainReact.js.map