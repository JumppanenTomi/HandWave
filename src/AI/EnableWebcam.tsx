export default async function EnableWebcam(video: HTMLVideoElement) {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
        video.srcObject = stream
        return
    })
}