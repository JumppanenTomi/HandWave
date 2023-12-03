import React from 'react';


function Webcam({webCamRef, canvasRef}: {webCamRef: React.RefObject<any>, canvasRef: React.RefObject<any> }) {
    return (
        <div
            style={{
                position: "relative",
                width: '100%',
                height: 'min-content',
            }}
        >
            <video
                autoPlay
                playsInline
                ref={webCamRef}
                style={{width: '100%', objectFit: "cover", borderRadius: 5}}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: "100%",
                    zIndex: 1,
                }}
            />
        </div>
    );
}

export default Webcam;
