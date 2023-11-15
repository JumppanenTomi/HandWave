import {ipcRenderer} from "electron";
import {GestureData} from "@/types/GestureData";
import {TriggerData} from "@/types/TriggerData";

export default async function ExecuteActions(gestureData: any[], actionData: any[]): Promise<void> {
    if (!gestureData || !actionData) {
        // Handle missing data
        console.error("Gesture data or action data is missing.");
        return;
    }

    const foundAction = actionData.find((entry) => entry.trigger === gestureData[0]?.category) as TriggerData;
    console.log(foundAction);

    if (!foundAction) {
        // Handle case when no action is found for the given gesture
        console.error("No action found for the gesture.");
        return;
    }

    for (const action of foundAction.actions) {
        switch (action.type) {
            case "keyboard":
                console.log("keyboard");
                if (action.press === "true") {
                    console.log("press");
                    await pressKey(action.key && parseInt(action.key.toString()));
                } else {
                    console.log("release");
                    await releaseKey(action.key && parseInt(action.key.toString()));
                }
                break;
            case "delay":
                console.log("delay");
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
    } catch (error) {
        console.error(error);
    }
}

async function releaseKey(data: any) {
    try {
        const response = await ipcRenderer.invoke('releaseKey', data);
    } catch (error) {
        console.error(error);
    }
}