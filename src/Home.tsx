import {Button, Col, Container, Dropdown, DropdownButton, Nav, Navbar, Row,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDisplay, faGear, faWindowMinimize, faXmark} from "@fortawesome/free-solid-svg-icons";
import React, {MutableRefObject, useContext, useEffect, useRef, useState,} from "react";
import {GestureData} from "./types/GestureData";
import {Link} from "react-router-dom";
import {ipcRenderer} from "electron";
import {ActionsDataContext} from "@/App";
import ExecuteActions from "@/executeActions";
import os from "os";
import { IndexFinger } from "./types/IndexFinger";
import HandVision from "@/AI/HandVision";
import EnableWebcam from "@/AI/EnableWebcam";
import FaceDetection from "@/AI/FaceVision";
import TopAppBar from "./TopAppBar";
import NavBar from "./NavBar";
import Webcam from "./Webcam";
import DesktopCapturer from "./DesktopCapturer";

const constraints = {
  video: true,
};

function Home() {
  const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);

  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(
    null
  );
  const { gestureData: actionData } = useContext(ActionsDataContext);


  const [gestureData, setGestureData] = useState<GestureData[]>();
  const [gestureAi, setGestureAi] = useState<any>();
  const [gazeAi, setGazeAi] = useState<any>();
  const [gazeState, setGazeState] = useState<boolean>(false);
  const [sources, setSources] = useState<Electron.DesktopCapturerSource[]>([]);
  const [sourceId, setSourceId] = useState<string>(
    localStorage.getItem("sourceId") || ""
  );
  const [recording, setRecording] = useState(false);
  const [indexFinger, setIndexFinger] = useState<IndexFinger[] | undefined>();
  const [hideElements, setHideElements] = useState(false);

  const isMac = os.platform() === "darwin";

  useEffect(() => {
    if (
      canvasRef !== null &&
      webCamRef.current != null &&
      canvasRef.current != null
    ) {
      setGestureAi(
        HandVision(
          webCamRef.current,
          canvasRef.current,
          setGestureData,
          setIndexFinger
        )
      );

      setGazeAi(
        FaceDetection(webCamRef.current, canvasRef.current, setGazeState)
      );
    }
  }, [canvasRef]);

  useEffect(() => {
    if (webCamRef.current) {
      EnableWebcam(webCamRef.current);
    }
    if (gestureAi) {
      gestureAi.createGestureRecognizer();
      if (webCamRef.current !== null) {
        const webcamCurrent = webCamRef.current;
        navigator.mediaDevices.getUserMedia(constraints).then(() => {
          webcamCurrent.addEventListener("loadeddata", gestureAi.predictWebcam);
        });
      }
    }
    if (gazeAi) {
      gazeAi.createFaceMeshRecognizer();
      if (webCamRef.current !== null) {
        const webcamCurrent = webCamRef.current;
        navigator.mediaDevices.getUserMedia(constraints).then(() => {
          webcamCurrent.addEventListener("loadeddata", gazeAi.predictWebcam);
        });
      }
    }
  }, [gestureAi, gazeAi]);

  useEffect(() => {
    const currentTime = Date.now();
    if (
      gestureData &&
      actionData &&
      gazeState &&
      (!lastExecutionTime || currentTime - lastExecutionTime >= 3000)
    ) {
      // Execute the actions only if the last execution was more than 3 seconds ago
      ExecuteActions(gestureData, actionData).then(() =>
        console.log("Actions executed")
      );
      setLastExecutionTime(currentTime);
    }
  }, [gestureData, actionData, lastExecutionTime]);

  useEffect(() => {
    if (indexFinger && gestureData && gestureData?.[0]?.category === "two_up") {
      ipcRenderer.invoke("mouseClick");
    }
  }, [gestureData]);

  useEffect(() => {
    if (indexFinger && gestureData && gestureData?.[0]?.category === "peace") {
      ipcRenderer.invoke("moveMouse", indexFinger[0]);
    }
  }, [gestureData]);

  useEffect(() => {
    ipcRenderer.send("REQUEST_SOURCES");
    ipcRenderer.on("GET_SOURCES", (e, content) => {
      setSources(content);
      // Check if there are available sources
      if (sourceId === "") {
        // Set the first source to the video element
        const firstSource = content[0];
        changeSource(firstSource.id);
      } else {
        // Set the source to the previously selected video element if navigated back to the home page
        changeSource(sourceId);
      }
    });
    ipcRenderer.on("refresh-sources", () => {
      ipcRenderer.send("REQUEST_SOURCES");
    });
    if (videoRef.current) {
      ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
        console.log(event);
        setSourceId(sourceId);
        localStorage.setItem("sourceId", sourceId);
        try {
          (navigator.mediaDevices as any)
            .getUserMedia({
              audio: isMac
                ? false
                : {
                    mandatory: {
                      chromeMediaSource: "desktop",
                    },
                  },
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: sourceId,
                  minWidth: 1920,
                  maxWidth: 1920,
                  minHeight: 1080,
                  maxHeight: 1080,
                },
              },
            } as unknown as MediaStreamConstraints)
            .then((stream: MediaStream) => {
              handleStream(stream, videoRef.current!);
            });
        } catch (e) {
          handleError(e);
        }
      });
    }
    // Clean up the listeners when the component unmounts
    return () => {
      ipcRenderer.removeAllListeners("GET_SOURCES");
      ipcRenderer.removeAllListeners("refresh-sources");
      ipcRenderer.removeAllListeners("SET_SOURCE");
    };
  }, [videoRef.current]);

  function handleStream(stream: MediaStream, video: HTMLVideoElement) {
    video.srcObject = stream;
    video.muted = true;
    video.onloadedmetadata = () => video.play();
  }

  function handleError(e: any) {
    console.log(e);
  }

  // Change the source of the video element
  const changeSource = (sourceId: string) => {
    setSourceId(sourceId);
    localStorage.setItem("sourceId", sourceId);
    (navigator.mediaDevices as any)
      .getUserMedia({
        audio: isMac
          ? false
          : {
              mandatory: {
                chromeMediaSource: "desktop",
              },
            },
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,
            minWidth: 1920,
            maxWidth: 1920,
            minHeight: 1080,
            maxHeight: 1080,
          },
        },
      } as unknown as MediaStreamConstraints)
      .then((stream: MediaStream) => {
        handleStream(stream, videoRef.current!);
      });
  };

  return (
    <div style={{ padding: 0 }}>
      {!hideElements && <TopAppBar />}
      <NavBar
        hideElements={hideElements}
        setHideElements={setHideElements}
        recording={recording}
        setRecording={setRecording}
      />
      <Row
        style={{ padding: hideElements ? 0 : 8, height: hideElements ? 0 : 8 }}
      >
        <Webcam
          hideElements={hideElements}
          canvasRef={canvasRef}
          webCamRef={webCamRef}
        />
        <DesktopCapturer
          hideElements={hideElements}
          videoRef={videoRef}
          recording={recording}
          setRecording={setRecording}
          sourceId={sourceId}
          isMac={isMac}
          changeSource={changeSource}
          sources={sources}
        />
      </Row>
    </div>
  );
}

export default Home;
