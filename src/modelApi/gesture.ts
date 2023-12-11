import {ActionType} from "@/types/ActionType";
import {Optional} from "sequelize";
import {ipcRenderer} from "electron";

/**
 * Represents the attributes of a gesture.
 *
 * @interface GestureAttributes
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
 * Retrieves all gestures from the main process using IPC communication.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of gesture objects.
 */
const getAllGestures = async () => {
    return ipcRenderer.invoke('get-all-gestures');
}

/**
 * Retrieves a gesture by its ID.
 *
 * @async
 * @param {number} id - The ID of the gesture to retrieve.
 * @returns {Promise<any>} A promise that resolves to the retrieved gesture.
 */
const getGesture = async (id: number) => {
    return ipcRenderer.invoke('get-gesture', id);
}

/**
 * Creates a new gesture with the provided attributes and actions.
 *
 * @param {GestureCreationAttributes} gesture - The attributes of the gesture to be created.
 * @param {ActionType[]} actions - The actions to be associated with the gesture.
 * @returns {Promise<unknown>} - A Promise that resolves to the result of invoking the 'create-gesture' event with the provided gesture and actions.
 */
const createGesture = async (gesture: GestureCreationAttributes, actions: ActionType[]) => {
    return ipcRenderer.invoke('create-gesture', gesture, actions);
}

/**
 * Updates a gesture with the specified ID, using the provided gesture and actions.
 *
 * @async
 * @param {number} id - The ID of the gesture to update.
 * @param {GestureCreationAttributes} gesture - The updated gesture object.
 * @param {ActionType[]} actions - The updated array of actions.
 * @returns {Promise} A Promise that resolves to the updated gesture.
 */
const updateGesture = async (id: number, gesture: GestureCreationAttributes, actions: ActionType[]) => {
    return ipcRenderer.invoke('update-gesture', id, gesture, actions);
}

/**
 * Delete a gesture.
 *
 * @param {number} id - The ID of the gesture to delete.
 * @returns {Promise} - A promise that resolves when the gesture is deleted.
 */
const deleteGesture = async (id: number) => {
    return ipcRenderer.invoke('delete-gesture', id);
}

export {getAllGestures, getGesture, createGesture, updateGesture, deleteGesture}