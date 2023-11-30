import { ipcRenderer } from 'electron';
import React, { useRef, useState } from 'react';
import { Button, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';


type DesktopCapturerProps = {
  hideElements: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  recording: boolean;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  sourceId: string;
  isMac: boolean;
  changeSource: (sourceId: string) => void;
  sources: Electron.DesktopCapturerSource[];
};

const DesktopCapturer: React.FC<DesktopCapturerProps> = ({
  hideElements,
  videoRef,
  recording,
  setRecording,
  sourceId,
  isMac,
  changeSource,
  sources,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [selectedSourceHighlighted, setSelectedSourceHighlighted] = useState<Electron.DesktopCapturerSource | null>(null);
  const recordingInterval = useRef<number | null>(null);
  const [recordedTime, setRecordedTime] = useState(0);


  // Toggle the recording state
  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording(sourceId);
    }
    // Toggle the recording state
    setRecording(!recording);
  };
  // END: ed8c6549bwf9

//Start recording the video
const startRecording = (sourceId: string) => {
    stopAndClearMediaRecorder();
    // Start recorder timer
    setRecordedTime(0);
    //@ts-ignore
    recordingInterval.current = setInterval(() => {
        setRecordedTime((prevTime: number) => prevTime + 1);
    }, 1000);

    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
        const constraints = {
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
        };

        // Get the audio stream from the microphone
        const getMicStream = () =>
            navigator.mediaDevices.getUserMedia({audio: true, video: false});

        // Get the video stream from the screen
        const getWindowStream = () =>
            navigator.mediaDevices.getUserMedia(constraints as unknown as MediaStreamConstraints);

        Promise.allSettled([getWindowStream(), getMicStream()])
            .then(([windowResult, micResult]) => {
                if (
                    windowResult.status === "fulfilled" &&
                    micResult.status === "fulfilled"
                ) {
                    const windowStream = windowResult.value;
                    const micStream = micResult.value;

                    console.log("micstream", micStream.getAudioTracks());
                    // Combine the video and mic streams
                    const combinedStream = new MediaStream();
                    windowStream
                        .getTracks()
                        .forEach((track) => combinedStream.addTrack(track));
                    micStream
                        .getAudioTracks()
                        .forEach((track) => combinedStream.addTrack(track));

                    const options = {
                        mimeType: "video/webm; codecs=vp9",
                    };

                    mediaRecorderRef.current = new MediaRecorder(
                        combinedStream,
                        options
                    );
                    mediaRecorderRef.current.ondataavailable =
                        handleStreamDataAvailable;
                    mediaRecorderRef.current.onstop = handleStreamEnded;

                    mediaRecorderRef.current.start();
                    console.log("Started recording");
                    mediaRecorderRef.current.onerror = (event) => {
                        console.log("Error: ", event);
                    };
                } else {
                    if ("reason" in windowResult) {
                        console.log("Error: ", windowResult.reason);
                    }
                    if ("reason" in micResult) {
                        console.log("Error: ", micResult.reason);
                    }
                }
            })
            .catch((error) => {
                console.error("Error getting streams:", error);
            });
    }
};

// Stop recording the video
const stopRecording = () => {
    stopAndClearMediaRecorder();
    //@ts-ignore
    clearInterval(recordingInterval.current);
    console.log("Stopped recording");
};

const stopAndClearMediaRecorder = () => {
    if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
    ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
    }
};

// Convert the timer to a time format
const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

// Send the recorded video to the main process
const handleStreamDataAvailable = async (e: BlobEvent) => {
    try {
        const data = await e.data.arrayBuffer();
        // Send the chunk data to the main process
        ipcRenderer.send("stream-chunk-received", new Uint8Array(data));
    } catch (error) {
        console.error("Error in handleStreamDataAvailable:", error);
    }
};

// Save the recorded video to the file system
const handleStreamEnded = async () => {
    ipcRenderer.send("recording-stopped");
};

  return (
    <Col style={{padding: hideElements ? 0 : 8, height: hideElements ? 0 : 8}}>
          <Col>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: hideElements ? 0 : "min-content",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                className={ !hideElements ? `video ${recording ? "recording" : ""}` : ""}
                style={{ width: hideElements ? '0' : '100%', objectFit: "cover", borderRadius: 5, border: hideElements ? "" : "2px solid transparent"
              }}
              />
            </div>
          </Col>
          {!hideElements && (
          <Row>
            <Col>
              <DropdownButton
                style={{
                  position: "relative",
                  display: "inline-block",
                  height: "min-content",
                }}
                title="Select Source"
                id="dropdown-basic-button"
              >
                {sources.map((source: Electron.DesktopCapturerSource | null, index: number) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => {
                      changeSource(source!.id);
                      setSelectedSourceHighlighted(source);
                    }}
                    style={
                      source === selectedSourceHighlighted
                        ? { backgroundColor: "#e8e9ea" }
                        : {}
                    }
                  >
                    {source?.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col>
              <Button
                variant={recording ? "danger" : "success"}
                onClick={toggleRecording}
              >
                {recording
                  ? `Stop Recording (${formatTime(recordedTime)})`
                  : "Start Recording"}
              </Button>
            </Col>
          </Row>
        )}
        </Col>
  );
};

export default DesktopCapturer;
