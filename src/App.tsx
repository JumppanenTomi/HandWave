import {Route, Routes} from "react-router-dom";
import React, {createContext, useEffect, useState} from "react";
import {TriggerData} from "./types/TriggerData";
import {getAllGestures} from "./modelApi/gesture";
import Home from "@/Views/Home";
import Settings from "@/Views/Settings";
import TopAppBar from "@/TopAppBar";
import NavBar from "@/Elements/NavBar";

type ActionsDataContextType = {
    actionData: TriggerData[] | undefined;
    setActionData: React.Dispatch<React.SetStateAction<TriggerData[] | undefined>> | undefined;
    gestureData: any[] | undefined;
    setGestureData: React.Dispatch<React.SetStateAction<any[] | undefined>> | undefined;
    forceRender: any,
}

type RecordingContextType = {
    recording: boolean;
    setRecording: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

export const ActionsDataContext = createContext<ActionsDataContextType>({
    actionData: undefined,
    setActionData: undefined,
    gestureData: undefined,
    setGestureData: undefined,
    forceRender: undefined
})

export const RecordingContext = createContext<RecordingContextType>({
    recording: false,
    setRecording: undefined
})

export default function App() {
    const [actionData, setActionData] = useState<TriggerData[] | undefined>()
    const [gestureData, setGestureData] = useState<any[] | undefined>([])
    const [render, setRender] = useState<object>({})
    const [recording, setRecording] = useState<boolean>(false)

    const [hideElements, setHideElements] = useState(false)

    useEffect(() => {
        const fetchGestureData = async () => {
            const data = await getAllGestures();
            setGestureData(data.map(it => it.dataValues));
        }

        fetchGestureData();
    }, [render])

    const forceRender = () => setRender({});

    return (
        <>
            {!hideElements && <TopAppBar/>}
            <NavBar
                hideElements={hideElements}
                setHideElements={setHideElements}
                recording={recording}
                setRecording={setRecording}
            />
            <ActionsDataContext.Provider value={{actionData, setActionData, gestureData, setGestureData, forceRender}}>
                <RecordingContext.Provider value={{recording, setRecording}}>
                    <Routes>
                        <Route index element={<Home/>}/>
                        <Route path={"/settings"} element={<Settings/>}/>
                    </Routes>
                </RecordingContext.Provider>
            </ActionsDataContext.Provider>
        </>
    )
}