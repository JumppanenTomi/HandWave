import {ActionType} from "@/types/ActionType";
import {Optional} from "sequelize";
import {ipcRenderer} from "electron";

/**
 * Represents the attributes of a gesture.
 *
 * @interface GestureAttributes
 *
 * @property {string | null} name - The name of the gesture.
 * @property {string | null} trigger - The trigger of the gesture.
 * @property {number | null} [id] - The unique identifier of the gesture (optional).
 * @property {any[] | null} [actions] - The actions associated with the gesture (optional).
 */
export interface GestureAttributes {
    name: string | null;
    trigger: string | null;
    id?: number | null;
    actions?: any[] | null;
}

/**
 * Represents the attributes required for creating a gesture.
 *
 * @interface
 * @extends Optional<GestureAttributes, 'id'>
 */
interface GestureCreationAttributes extends Optional<GestureAttributes, 'id'> {
}

/**
 * Retrieves all the gestures from the renderer process.
 *
 * @async
 * @returns {Promise<Array>} A promise that resolves to an array of all gestures.
 */
const getAllGestures = async () => {
    return ipcRenderer.invoke('get-all-gestures');
}

/**
 * Retrieves a gesture based on the provided ID.
 *
 * @param {number} id - The ID of the gesture to retrieve.
 * @returns {Promise} Returns a promise that resolves with the gesture object.
 */
const getGesture = async (id: number) => {
    return ipcRenderer.invoke('get-gesture', id);
}

/**
 * Creates a new gesture by invoking the 'create-gesture' method in ipcRenderer with the provided gesture and actions.
 *
 * @param {GestureCreationAttributes} gesture - The details of the gesture to be created.
 * @param {ActionType[]} actions - The list of actions associated with the gesture.
 * @returns {Promise} - A promise that resolves with the result of invoking 'create-gesture' method.
 */
const createGesture = async (gesture: GestureCreationAttributes, actions: ActionType[]) => {
    return ipcRenderer.invoke('create-gesture', gesture, actions);
}

/**
 * Updates a gesture with specified id, gesture attributes, and actions.
 *
 * @async
 * @param {number} id - The id of the gesture to be updated.
 * @param {GestureCreationAttributes} gesture - The updated attributes for the gesture.
 * @param {ActionType[]} actions - The updated actions for the gesture.
 * @returns {Promise<any>} - A promise that resolves to the result of the update operation.
 */
const updateGesture = async (id: number, gesture: GestureCreationAttributes, actions: ActionType[]) => {
    return ipcRenderer.invoke('update-gesture', id, gesture, actions);
}

/**
 * Delete a gesture.
 *
 * @async
 * @param {number} id - The ID of the gesture to delete.
 * @returns {Promise<void>} - A Promise that resolves when the gesture is deleted.
 */
const deleteGesture = async (id: number) => {
    return ipcRenderer.invoke('delete-gesture', id);
}

export {getAllGestures, getGesture, createGesture, updateGesture, deleteGesture}