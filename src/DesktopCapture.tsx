/*import { ipcRenderer } from 'electron';

export default function DesktopCapture(video: HTMLVideoElement) {

    ipcRenderer.on('SET_SOURCE', (event, sourceId) => {
      console.log('Received SET_SOURCE event with sourceId:', sourceId);
      try {
        const stream = navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        })
        handleStream(stream, video)
      } catch (e) {
        handleError(e)
        console.log("PROBLEM HERE");
        
      }
    })

function handleStream (stream, video) {
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play()
}

function handleError (e) {
  console.log(e)
}

return {
  DesktopCapture
}


}
*/