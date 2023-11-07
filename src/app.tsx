import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {GestureData} from "./types/GestureData";
import Ai from "./Ai";
import {Button} from "react-bootstrap";
import SourceDropdown from './SourceDropdown';
import { ipcRenderer } from "electron";


const constraints = {
    video: true
};

function App() {
    const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [sources, setSources] = useState<Electron.DesktopCapturerSource[]>([]);

    const [gestureData, setGestureData] = useState<GestureData[]>()
    const [btnText, setBtnText] = useState<string>("Enable webcam")
    const [error, setError] = useState<string | undefined>()
    const [ai, setAi] = useState<any>()

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

    /*
    useEffect(() => {
    ipcRenderer.on("GET_SOURCES", (e, content) => {
      console.log("Have Event", { e, content });
      setSources(content);
    });
    if (videoRef.current) {
      ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
        console.log(event);
        try {
          (navigator.mediaDevices as any)
            .getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: sourceId,
                  minWidth: 1280,
                  maxWidth: 1280,
                  minHeight: 720,
                  maxHeight: 720,
                },
              },
            })
            .then((stream: MediaStream) => {
              handleStream(stream, videoRef.current!);
            });
        } catch (e) {
          handleError(e);
        }
      });
    }
  }, [videoRef.current]);

  function handleStream(stream: MediaStream, video: HTMLVideoElement) {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
  }

  function handleError(e: any) {
    console.log(e);
  }

  const changeSource = (source: Electron.DesktopCapturerSource) => {
    (navigator.mediaDevices as any)
            .getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
          },
        },
      })
      .then((stream: MediaStream) => {
        handleStream(stream, videoRef.current!);
      });
  };*/



    return (
        <>
            <div style={{position: "relative"}}>
                <video
                    src=''
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
                <SourceDropdown/>
                <div id='player' style={{position: "relative"}}>
                </div>
            {gestureData &&
                gestureData.map((item) => (
                    <p>{item.category} {item.confidence.toFixed(2)} {item.hand}</p>
                    ))
                }
                <video id="video" ref={videoRef}></video>
                <div className="App">
      <video ref={videoRef} autoPlay></video>
      {sources.map((source) => {
        return (
          <button onClick={() => changeSource(source)}>{source.name}</button>
        );
      })}
    </div>
        </>
    );
}

export default App;
