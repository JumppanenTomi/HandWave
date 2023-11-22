import { Col, Container } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import Ai from './Ai'; // Import the Ai module
import { ActionsDataContext } from './App'; // Import the ActionsDataContext
import { GestureData } from './types/GestureData'; // Import the GestureData type

const constraints = {
  video: true,
};

function HomeAlternative() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webCamRef = useRef<HTMLVideoElement>(null);
  const [ai, setAi] = useState<any>();
  const [gestureData, setGestureData] = useState<GestureData[]>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (canvasRef !== null && webCamRef.current != null && canvasRef.current != null) {
      setAi(Ai(webCamRef.current, canvasRef.current, setGestureData, setError));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (ai) {
      ai.createGestureRecognizer().then(() => {
        ai.enableCam();
      });
      if (webCamRef.current !== null) {
        navigator.mediaDevices.getUserMedia(constraints).then(() => {
          webCamRef.current.addEventListener('loadeddata', ai.predictWebcam);
        });
      }
    }
  }, [ai]);

  return (
    <Container>
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
    </Container>
  );

}

export default HomeAlternative;