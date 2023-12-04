import {ipcRenderer} from "electron";
import {TriggerData} from "@/types/TriggerData";
import {Dispatch, SetStateAction} from "react";

export default async function ExecuteActions(gestureData: any[], actionData: any[], lastExecution: number | undefined, setExecutionTime: Dispatch<SetStateAction<number | undefined>>): Promise<void> {
    if (!gestureData || !actionData) {
        // Handle missing data
        console.error("Gesture data or action data is missing.");
        return;
    }

    const foundAction = actionData.find((entry) => entry.trigger === gestureData[0]?.category) as TriggerData;

    if (!foundAction) {
        // Handle case when no action is found for the given gesture
        console.error("No action found for the gesture.");
        return;
    }

    const time = new Date().getTime();
    if (lastExecution && (time - lastExecution > 3000)) {
        console.error("too soon");
        return
    }
    setExecutionTime(time)

    for (const action of foundAction.actions) {
        switch (action.type) {
            case "keyboard":
                console.log("keyboard");
                // @ts-ignore
                if (action.press === "true") {
                    console.log("press");
                    await pressKey(action.key && action.key);
                } else {
                    console.log("release");
                    await releaseKey(action.key && action.key);
                }
                break;
            case "delay":
                console.log("delay");
                // @ts-ignore
                await new Promise<void>(resolve => setTimeout(resolve, action.delay));
                console.log("time ended");
                break;
            default:
                break;
        }
    }
}

async function pressKey(data: any) {
    try {
        const response = await ipcRenderer.invoke('pressKey', data);
        console.log(response)
    } catch (error) {
        console.error(error);
    }
}

async function releaseKey(data: any) {
    try {
        const response = await ipcRenderer.invoke('releaseKey', data);
        console.log(response)
    } catch (error) {
        console.error(error);
    }
}