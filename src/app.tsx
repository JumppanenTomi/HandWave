import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {GestureData} from "./types/GestureData";
import Ai from "./Ai";
import {Button} from "react-bootstrap";
import { getAllUsers } from "./modelapi/user";
import {NewUser} from "./modelapi/user"

const constraints = {
    video: true
};

function App() {
    const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const [gestureData, setGestureData] = useState<GestureData[]>()
    const [btnText, setBtnText] = useState<string>("Enable webcam")
    const [error, setError] = useState<string | undefined>()
    const [ai, setAi] = useState<any>()
    const [users, setUsers] = useState<NewUser[]>()

    useEffect(() => {
        if (canvasRef !== null) {
            setAi(Ai(webCamRef.current, canvasRef.current, setGestureData, setBtnText, setError))
        }
    }, [canvasRef]);

    useEffect(() => {
        if (ai) {
            ai.createGestureRecognizer()
            navigator.mediaDevices.getUserMedia(constraints).then(() => {
                webCamRef.current.addEventListener("loadeddata", ai.predictWebcam);
            });
        }
    }, [ai]);

    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error]);

    useEffect(() => {
        const fetchData = async () => {
            const test = await getAllUsers()
            setUsers(test)
        }
        
        fetchData()
    }, [])


    return (
        <>
            <div style={{position: "relative"}}>
                <video
                    autoPlay
                    playsInline
                    ref={webCamRef}
                    style={{width: "50%", height: "50%", objectFit: "cover"}}
                />
                <canvas
                    ref={canvasRef}
                    style={{position: "absolute", top: 0, left: 0, width: "50%", height: "100%", zIndex: 1}}
                />
            </div>
            <Button ref={buttonRef} onClick={ai && ai.enableCam}>{btnText}</Button>
            {gestureData &&
                gestureData.map((item) => (
                    <p>{item.category} {item.confidence.toFixed(2)} {item.hand}</p>
                ))
            }

            {users.map((user) => (
                <p>{user.firstName}</p>
            ))
            }
        </>
    );
}

export default App;
