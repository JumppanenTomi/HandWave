import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";
import React, {createContext, useEffect, useState} from "react";
import {TriggerData} from "./types/TriggerData";
import { getAllGestures } from "./modelApi/gesture";

type ActionsDataContextType = {
    actionData: TriggerData[] | undefined;
    setActionData: React.Dispatch<React.SetStateAction<TriggerData[] | undefined>> | undefined;
    gestureData: any[] | undefined;
    setGestureData: React.Dispatch<React.SetStateAction<any[] | undefined>> | undefined;
    forceRender: any,
}

export const ActionsDataContext = createContext<ActionsDataContextType>({
    actionData: undefined,
    setActionData: undefined,
    gestureData: undefined,
    setGestureData: undefined,
    forceRender: undefined
})

export default function App() {
    const [actionData, setActionData] = useState<TriggerData[] | undefined>()
    const [gestureData, setGestureData] = useState<any[] | undefined>([])
    const [render, setRender] = useState<object>({})

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

    return (
        <ActionsDataContext.Provider value={{actionData, setActionData, gestureData, setGestureData, forceRender}}>
            <Routes>
                <Route index element={<Home/>}/>
                <Route path={"/settings"} element={<Settings/>}/>
            </Routes>
        </ActionsDataContext.Provider>
    )
}