import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";
import React, {createContext} from "react";

export default function App(){
    return (
        <Routes>
            <Route index element={<Home/>}/>
            <Route path={"/settings"} element={<Settings/>}/>
        </Routes>
    )
}