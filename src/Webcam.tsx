import React from 'react';
import { Col } from 'react-bootstrap';


const Webcam: React.FC<{ hideElements: boolean, webCamRef: React.RefObject<any>, canvasRef: React.RefObject<any> }> = ({ hideElements, webCamRef, canvasRef }) => {
  return (
    <Col xs={6} style={{padding: hideElements ? 0 : 8, height: hideElements ? 0 : 8}}>
          <div
            style={{
              position: "relative",
              width: hideElements ? '0' : '100%',
              height: hideElements ? '0' : 'min-content',
            }}
          >
            <video
              autoPlay
              playsInline
              ref={webCamRef}
              style={{ width: hideElements ? '0' : '100%', objectFit: "cover", borderRadius: 5 }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: hideElements ? '0' : '100%',
                height: "100%",
                zIndex: 1,
              }}
            />
          </div>
        </Col>
  );
};

export default Webcam;
