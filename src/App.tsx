import React, {createContext, useEffect, useState} from "react";
import {TriggerData} from "./types/TriggerData";
import {getAllGestures} from "./modelApi/gesture";
import Home from "@/Views/Home";
import NotificationManager from "@/Elements/NotificationManager";
import {ipcRenderer} from "electron";

type ActionsDataContextType = {
    actionData: TriggerData[] | undefined;
    setActionData: React.Dispatch<React.SetStateAction<TriggerData[] | undefined>> | undefined;
    gestureData: any[] | undefined;
    setGestureData: React.Dispatch<React.SetStateAction<any[] | undefined>> | undefined;
    forceRender: any,
}

type RecordingContextType = {
    recording: boolean | undefined;
    setRecording: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

type RecordTimeContextType = {
    recordedTime: number;
    setRecordedTime: React.Dispatch<React.SetStateAction<number>>;
}

type MinimalViewContextType = {
    minimalView: boolean;
    setMinimalView: React.Dispatch<React.SetStateAction<boolean>>;
}
type FaceMeshContextType = {
    mesh: "true" | "false";
    setMesh: React.Dispatch<React.SetStateAction<"true" | "false">>;
}
type FaceDetectionContextType = {
    faceDetection: "true" | "false";
    setFaceDetection: React.Dispatch<React.SetStateAction<"true" | "false">>;
}

type NotificationManagerContextType = { notificationManager: typeof NotificationManager }

export const ActionsDataContext = createContext<ActionsDataContextType>({
    actionData: undefined,
    setActionData: undefined,
    gestureData: undefined,
    setGestureData: undefined,
    forceRender: undefined
})

export const RecordingContext = createContext<RecordingContextType>({
    recording: undefined,
    setRecording: () => {
    }
})

export const RecordedTimeContext = createContext<RecordTimeContextType>({
    recordedTime: 0,
    setRecordedTime: () => {
    }
})

export const MinimalViewContext = createContext<MinimalViewContextType>({
    minimalView: false,
    setMinimalView: () => {
    }
})

export const MeshContext = createContext<FaceMeshContextType>({
    mesh: "false",
    setMesh: () => {
    }
})

export const FaceDetectionContext = createContext<FaceDetectionContextType>({
    faceDetection: "false",
    setFaceDetection: () => {
    }
})

export const NotificationManagerContext = createContext<NotificationManagerContextType>({notificationManager: NotificationManager});

export default function App() {
    const [actionData, setActionData] = useState<TriggerData[] | undefined>()
    const [gestureData, setGestureData] = useState<any[] | undefined>([])
    const [render, setRender] = useState<object>({})

    const [recording, setRecording] = useState<boolean>()
    const [recordedTime, setRecordedTime] = useState<number>(0);

    const notificationManager = NotificationManager()

    const [minimalView, setMinimalView] = useState<boolean>(false)
    const [mesh, setMesh] = useState<"true" | "false">("false")
    const [faceDetection, setFaceDetection] = useState<"true" | "false">("false")

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