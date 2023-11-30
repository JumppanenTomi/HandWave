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
        //@ts-ignore
        switch (action.type) {
            case "keyboard":
                console.log("keyboard");
                // @ts-ignore
                if (action.press === "true") {
                    console.log("press");
                    // @ts-ignore
                    await pressKey(action.key && parseInt(action.key.toString()));
                } else {
                    console.log("release");
                    // @ts-ignore
                    await releaseKey(action.key && parseInt(action.key.toString()));
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