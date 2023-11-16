import {
  Col,
  Container,
  Row,
  Button,
  Navbar,
  Nav,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { GestureData } from "./types/GestureData";
import Ai from "./Ai";
import { Link } from "react-router-dom";
import { ipcRenderer } from "electron";
import os from 'os';


const constraints = {
  video: true,
};

function Home() {
  const webCamRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);

  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [gestureData, setGestureData] = useState<GestureData[]>();
  const [error, setError] = useState<string | undefined>();
  const [ai, setAi] = useState<any>();
  const [sources, setSources] = useState<Electron.DesktopCapturerSource[]>([]);
  const [sourceId, setSourceId] = useState<string>(localStorage.getItem('sourceId') || "");  const [recording, setRecording] = useState(false);

  const isMac = os.platform() === 'darwin';

  useEffect(() => {
    if (canvasRef !== null) {
      setAi(Ai(webCamRef.current, canvasRef.current, setGestureData, setError));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (ai) {
      ai.createGestureRecognizer().then(() => {
        ai.enableCam();
      });
      navigator.mediaDevices.getUserMedia(constraints).then(() => {
        webCamRef.current.addEventListener("loadeddata", ai.predictWebcam);
      });
    }
  }, [ai]);

  useEffect(() => {
    const handleGestureData = () => {
      if (gestureData && gestureData[0].category === "paper") {
        ipcRenderer
          .invoke("pressKey", "space")
          .then(() => ipcRenderer.invoke("releaseKey", "space"))
          .catch((error) => console.error(error));
      }
    };

    handleGestureData();
  }, [gestureData]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

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
        localStorage.setItem('sourceId', sourceId);
        try {
          (navigator.mediaDevices as any)
      .getUserMedia({
        audio: isMac ? false : {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
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
      })
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
    video.onloadedmetadata = (e) => video.play();
  }

  function handleError(e: any) {
    console.log(e);
  }

  const changeSource = (sourceId: string) => {
    setSourceId(sourceId);
    localStorage.setItem('sourceId', sourceId);
    (navigator.mediaDevices as any)
      .getUserMedia({
        audio: isMac ? false : {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
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
      })
      .then((stream: MediaStream) => {
        handleStream(stream, videoRef.current!);
      });
  };

  const toggleRecording = () => {
    if (recording) {
      // Stop the recording
      stopRecording();
    } else {
      // Start the recording
      startRecording(sourceId);
    }

    // Toggle the recording state
    setRecording(!recording);
  };

  const startRecording = (sourceId: string) => {
    stopAndClearMediaRecorder();
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
        
      const constraints = {
        audio: isMac ? false : {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        },
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
            minWidth: 1920,
            maxWidth: 1920,
            minHeight: 1080,
            maxHeight: 1080,
          },
        },
      };
  
      const getMicStream = () =>
        navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  
      const getWindowStream = () =>
        navigator.mediaDevices.getUserMedia(constraints);
  
      Promise.allSettled([getWindowStream(), getMicStream()])
        .then(([windowResult, micResult]) => {
          if (windowResult.status === "fulfilled" && micResult.status === "fulfilled") {
            const windowStream = windowResult.value;
            const micStream = micResult.value;

            console.log("micstream", micStream.getAudioTracks());
            
            const combinedStream = new MediaStream();
            windowStream.getTracks().forEach((track) => combinedStream.addTrack(track));
            micStream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
    
            const options = {
              mimeType: "video/webm; codecs=vp9",
            };
    
            mediaRecorderRef.current = new MediaRecorder(combinedStream, options);
            mediaRecorderRef.current.ondataavailable = handleStreamDataAvailable;
            mediaRecorderRef.current.onstop = handleStreamEnded;
    
            mediaRecorderRef.current.start();
            console.log("Started recording");
            mediaRecorderRef.current.onerror = (event) => {
              console.log("Error: ", event);
            };
          } else {
            console.log("Error: ", windowResult.reason || micResult.reason);
            
          }
        })
        .catch((error) => {
          console.error("Error getting streams:", error);
        });
    }
  };

  const stopRecording = () => {
    stopAndClearMediaRecorder();
    console.log("Stopped recording");
  };

  const stopAndClearMediaRecorder = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };
  
  const handleStreamDataAvailable = async (e: BlobEvent) => {
    try {
      const data = await e.data.arrayBuffer();
      // Send the chunk data to the main process
      ipcRenderer.send("stream-chunk-received", new Uint8Array(data));
    } catch (error) {
      console.error("Error in handleStreamDataAvailable:", error);
    }
  };

  const handleStreamEnded = async () => {
    ipcRenderer.send("recording-stopped");
  };

  return (
    <Container>
      <Navbar expand={"lg"}>
        <Container>
          <Nav>
            <Navbar.Text>
              <h1>GesturePresentation</h1>
            </Navbar.Text>
          </Nav>
          <Nav.Link>
            <Link to={"/settings"}>
              <Button>
                <FontAwesomeIcon icon={faGear} />
              </Button>
            </Link>
          </Nav.Link>
        </Container>
      </Navbar>
      <Row>
        <Col xs={6}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "min-content",
            }}
          >
            <video
              autoPlay
              playsInline
              ref={webCamRef}
              style={{ width: "100%", objectFit: "cover", borderRadius: 5 }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            />
          </div>
          {gestureData &&
            gestureData.map((item, index) => (
              <p key={index}>
                {item.category} {item.confidence.toFixed(2)} {item.hand}
              </p>
            ))}
        </Col>
        <Col>
          <video
            ref={videoRef}
            autoPlay
            style={{ width: "100%", objectFit: "cover", borderRadius: 5 }}
          />
          <Col>
            <DropdownButton
              style={{ marginRight: 0 }}
              title="Select Desktop Source"
              id="dropdown-basic-button"
            >
              {sources.map((source, index) => (
                <Dropdown.Item key={index} onClick={() => changeSource(source.id)}>
                  {source.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <Col style={{ marginTop: 8 }}>
              <Button
                variant={recording ? "danger" : "success"}
                size="sm"
                onClick={toggleRecording}
              >
                {recording ? "Stop Recording" : "Start Recording"}
              </Button>
            </Col>
          </Col>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
