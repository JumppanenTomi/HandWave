/**
 * Enable the webcam for capturing video.
 *
 * @param {HTMLVideoElement} video - The HTML video element to display the webcam video stream.
 *
 * @return {Promise} - A promise that resolves when the webcam stream is enabled.
 */
export default async function EnableWebcam(video: HTMLVideoElement) {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
        video.srcObject = stream
        return
    })
}