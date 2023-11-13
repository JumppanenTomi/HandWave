import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";
import React, {createContext, useState} from "react";
import {TriggerData} from "./types/TriggerData";

type ActionsDataContextType = {
    actionData: TriggerData[] | undefined;
    setActionData: React.Dispatch<React.SetStateAction<TriggerData[] | undefined>> | undefined;
}

export const ActionsDataContext = createContext<ActionsDataContextType>({
    actionData: undefined,
    setActionData: undefined
})

export default function App() {
    const [actionData, setActionData] = useState<TriggerData[] | undefined>()

    return (
        <ActionsDataContext.Provider value={{actionData, setActionData}}>
            <Routes>
                <Route index element={<Home/>}/>
                <Route path={"/settings"} element={<Settings/>}/>
            </Routes>
        </ActionsDataContext.Provider>
    )
}