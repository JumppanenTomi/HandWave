import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./app";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from "react-router-dom";
import App from "./App";

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);