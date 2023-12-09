<div>
<img src="./src/assets/handwave-logo.svg" alt="logo" width="300"/>
<hr />
<div>
Harness the power of your hand gestures to effortlessly control your computer with Handwave, an AI-based application that utilizes Google MediaPipe for gesture recognition and face landmarking.

## Overview
Handwave transforms your hand movements into intuitive commands, enabling you to navigate your computer, control presentations, and interact with applications without the need for traditional input devices. Leveraging MediaPipe's robust hand and face recognition capabilities, Handwave integrates gesture recognition with mouse control, presentation recording, and facial detection, making it a versatile tool for enhancing accessibility and productivity.

## Technology Stack
- **Front-ennd**: React, TypeScript, Vite
- **Back-end**: Electron, Sequelize, SQLite3

## Modal Dataset
Handwave utilizes HaGRID Dataset, a valuable resource for developing hand gesture recognition systems. It contains a variety of gestures, including common symbols, numbers, and commands, as well as a wide range of subjects and lighting conditions. Key enhancements to the dataset include:
- An expansion to 18 gestures
- An augmentation to 18,000 images
- Achieving a test accuracy of 0.86
<div>
<img src="./src/assets/gestures.jpg" alt="gestures"/>
<div>

## Features
### Gesture Recognition:
- Seamlessly recognize hand gestures using MediaPipe Hands
- Map gestures to custom-defined actions for intuitive input
- Receive visual feedback for gesture recognition

### Hand Landmarking:
- Control the mouse pointer using the "V" gesture
- Perform left-click selections using thumbs

### Face Landmarking:
- Track facial landmarks using MediaPipe Face Mesh
- Prevent unintentional keystrokes by maintaining face detection

### Presentation Recording.
- Select window or applications for interacting and recording
- Save recordings to your local drive once finished

### Cross-platform Compatibility:
- Electron enables deployment on various operating systems (Windows, macOS, Linux)

## Authors
- Tomi Jumppanen
- Roope Laine
- Anton Tugushi
- Dat Pham

## Credits
- [HaGRID](https://github.com/hukenovs/hagrid)