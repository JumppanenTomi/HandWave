import {ipcRenderer} from "electron";
import {TriggerData} from "@/types/TriggerData";
import {Dispatch, SetStateAction} from "react";

/**
 * ExecuteActions function executes a series of actions based on given gesture and action data.
 *
 * @param gestureData - An array containing the data of the gesture.
 * @param actionData - An array containing the data of the actions.
 * @param lastExecution - The time of the last execution, or undefined if it's the first execution.
 * @param setExecutionTime - A function to update the time of the last execution.
 * @returns A promise that resolves when all the actions have been executed.
 */
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
    if (lastExecution && (time - lastExecution < 3000)) {
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

/**
 * Function to press a key using the ipcRenderer.invoke method.
 *
 * @param {any} data - The data to be passed to the 'pressKey' action.
 * @returns {Promise<void>} - A Promise that resolves with no value on success, or rejects with an error on failure.
 */
async function pressKey(data: any) {
    try {
        const response = await ipcRenderer.invoke('pressKey', data);
        console.log(response)
    } catch (error) {
        console.error(error);
    }
}

/**
 * Release a key using the provided data.
 *
 * @param {any} data - The data required to release the key.
 *
 * @return {Promise<void>} - A promise that resolves when the key is successfully released.
 */
async function releaseKey(data: any) {
    try {
        const response = await ipcRenderer.invoke('releaseKey', data);
        console.log(response)
    } catch (error) {
        console.error(error);
    }
}