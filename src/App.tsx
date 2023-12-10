import React, {createContext, useEffect, useState} from "react";
import {TriggerData} from "./types/TriggerData";
import {getAllGestures} from "./modelApi/gesture";
import Home from "@/Views/Home";
import NotificationManager from "@/Elements/NotificationManager";
import {ipcRenderer} from "electron";

/**
 * Represents a data context type for actions.
 * @typedef {Object} ActionsDataContextType
 * @property {TriggerData[] | undefined} actionData - The action data.
 * @property {React.Dispatch<React.SetStateAction<TriggerData[] | undefined>> | undefined} setActionData - A function to set the action data.
 * @property {any[] | undefined} gestureData - The gesture data.
 * @property {React.Dispatch<React.SetStateAction<any[] | undefined>> | undefined} setGestureData - A function to set the gesture data.
 * @property {any} forceRender - Used to trigger a re-render of the component.
 */
type ActionsDataContextType = {
    actionData: TriggerData[] | undefined;
    setActionData: React.Dispatch<React.SetStateAction<TriggerData[] | undefined>> | undefined;
    gestureData: any[] | undefined;
    setGestureData: React.Dispatch<React.SetStateAction<any[] | undefined>> | undefined;
    forceRender: any,
}

/**
 * Represents the type definition for the RecordingContextType.
 * @typedef {Object} RecordingContextType
 * @property {boolean | undefined} recording - Indicates whether recording is enabled or not.
 * @property {React.Dispatch<React.SetStateAction<boolean | undefined>>} setRecording - Function that can be used to update the recording state.
 */
type RecordingContextType = {
    recording: boolean | undefined;
    setRecording: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

/**
 * Type definition for RecordTimeContextType.
 *
 * @typedef {Object} RecordTimeContextType
 * @property {number} recordedTime - The recorded time value.
 * @property {React.Dispatch<React.SetStateAction<number>>} setRecordedTime - Function to set the recorded time value.
 */
type RecordTimeContextType = {
    recordedTime: number;
    setRecordedTime: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * @typedef {Object} MinimalViewContextType
 * @property {boolean} minimalView - Indicates if the minimal view is enabled.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setMinimalView - Function to set the minimal view.
 */
type MinimalViewContextType = {
    minimalView: boolean;
    setMinimalView: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Represents the context type for managing the face mesh state.
 * @typedef {Object} FaceMeshContextType
 * @property {boolean} mesh - The current face mesh state.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setMesh - Function to update the face mesh state.
 */
type FaceMeshContextType = {
    mesh: boolean;
    setMesh: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Represents the context type for face detection feature.
 * @typedef {Object} FaceDetectionContextType
 * @property {boolean} faceDetection - Indicates whether face detection is enabled or not.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setFaceDetection - A function to update the state of face detection.
 */
type FaceDetectionContextType = {
    faceDetection: boolean;
    setFaceDetection: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @typedef {Object} NotificationManagerContextType
 * @property {any} notificationManager - The type of the NotificationManager object.
 */
type NotificationManagerContextType = { notificationManager: any }

/**
 * @typedef {Object} ActionsDataContextType
 * @property {*} actionData - The action data.
 * @property { function } setActionData - A function to set the action data.
 * @property {*} gestureData - The gesture data.
 * @property { function } setGestureData - A function to set the gesture data.
 * @property { function } forceRender - A function to force render.
 */
export const ActionsDataContext = createContext<ActionsDataContextType>({
    actionData: undefined,
    setActionData: undefined,
    gestureData: undefined,
    setGestureData: undefined,
    forceRender: undefined
})

/**
 * Represents the recording context.
 *
 * @typedef {Object} RecordingContextType
 * @property {Recording} recording - The current recording.
 * @property {Function} setRecording - Function to set the recording.
 */
export const RecordingContext = createContext<RecordingContextType>({
    recording: undefined,
    setRecording: () => {
    }
})

/**
 * Context variable for recording time.
 *
 * @typedef {Object} RecordTimeContextType
 * @property {number} recordedTime - The recorded time value.
 * @property {function} setRecordedTime - A function to set the recorded time value.
 */
export const RecordedTimeContext = createContext<RecordTimeContextType>({
    recordedTime: 0,
    setRecordedTime: () => {
    }
})

/**
 * Creates a context for managing the minimal view state.
 *
 * @typedef {object} MinimalViewContextType
 * @property {boolean} minimalView - The current state of the minimal view.
 * @property {Function} setMinimalView - A function to update the minimal view state.
 */
export const MinimalViewContext = createContext<MinimalViewContextType>({
    minimalView: false,
    setMinimalView: () => {
    }
})

/**
 * Represents the context for manipulating a face mesh.
 *
 * @typedef {Object} MeshContext
 * @property {FaceMeshContextType} value - The value of the context.
 * @property {boolean} value.mesh - Specifies whether the mesh is active or not.
 * @property {function} value.setMesh - A function to update the mesh value.
 *
 * @example
 * // Create a new context with mesh set to false
 * const meshContext = createContext<FaceMeshContextType>({
 *   mesh: false,
 *   setMesh: () => {}
 * });
 *
 * @example
 * // Access the mesh context value and update the mesh value
 * const { mesh, setMesh } = useContext(meshContext);
 * setMesh(true); // Set the mesh to true
 * setMesh(false); // Set the mesh to false
 */
export const MeshContext = createContext<FaceMeshContextType>({
    mesh: false,
    setMesh: () => {
    }
})

/**
 * Represents the context for face detection.
 *
 * @typedef {Object} FaceDetectionContext
 * @property {boolean} faceDetection - determines if face detection is enabled or disabled.
 * @property {Function} setFaceDetection - function to set the value of faceDetection.
 */
export const FaceDetectionContext = createContext<FaceDetectionContextType>({
    faceDetection: false,
    setFaceDetection: () => {
    }
})

/**
 * Represents the context for the NotificationManager.
 *
 * @typedef {Object} NotificationManagerContextType
 * @property {NotificationManager} notificationManager - An instance of the notification manager.
 */
export const NotificationManagerContext = createContext<NotificationManagerContextType>({notificationManager: NotificationManager});

/**
 * App component
 *
 * Initializes and manages the state of various components and data in the application.
 *
 * @returns {JSX.Element} The rendered component
 */
export default function App() {
    const [actionData, setActionData] = useState<TriggerData[] | undefined>()
    const [gestureData, setGestureData] = useState<any[] | undefined>([])
    const [render, setRender] = useState<object>({})

    const [recording, setRecording] = useState<boolean>()
    const [recordedTime, setRecordedTime] = useState<number>(0);

    const notificationManager = NotificationManager()

    const [minimalView, setMinimalView] = useState<boolean>(false)
    const [mesh, setMesh] = useState<boolean>(false)
    const [faceDetection, setFaceDetection] = useState<boolean>(false)

    useEffect(() => {
        const fetchGestureData = async () => {
            let data: any = await getAllGestures();
            data = JSON.stringify(data);
            data = JSON.parse(data);
            setGestureData(data);
        }

        fetchGestureData();
    }, [render])

    const forceRender = () => setRender({});

    useEffect(() => {
        ipcRenderer.send('toggle-elements', minimalView)
    }, [minimalView]);

    return (
        <>
            {!minimalView && notificationManager.notificationElement}
            <RecordedTimeContext.Provider value={{recordedTime, setRecordedTime}}>
                <MeshContext.Provider value={{mesh, setMesh}}>
                    <FaceDetectionContext.Provider value={{faceDetection, setFaceDetection}}>
                        <MinimalViewContext.Provider value={{minimalView, setMinimalView}}>
                            <NotificationManagerContext.Provider
                                value={{notificationManager: () => notificationManager}}>
                                <ActionsDataContext.Provider
                                    value={{actionData, setActionData, gestureData, setGestureData, forceRender}}>
                                    <RecordingContext.Provider value={{recording, setRecording}}>
                                        <Home/>
                                    </RecordingContext.Provider>
                                </ActionsDataContext.Provider>
                            </NotificationManagerContext.Provider>
                        </MinimalViewContext.Provider>
                    </FaceDetectionContext.Provider>
                </MeshContext.Provider>
            </RecordedTimeContext.Provider>
        </>
    )
}