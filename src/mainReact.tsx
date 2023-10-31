import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./app";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);