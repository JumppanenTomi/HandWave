import ReactDOM from "react-dom/client";
import App from "./app";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

postMessage({ payload: "removeLoading" }, "*");