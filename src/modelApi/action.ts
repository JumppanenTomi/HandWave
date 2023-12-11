import {Optional} from "sequelize";
import {ipcRenderer} from "electron";

/**
 * Represents the attributes for an action.
 * @interface ActionAttributes
 */
export interface ActionAttributes {
    press: string | null;
    key: string | null;
    type: string | null;
    delay: number | null;
    gestureId?: number | null;
    id?: number | null;
}

/**
 * Represents the attributes for creating an action.
 *
 * @interface ActionCreationAttributes
 * @extends Optional<ActionAttributes, 'id'>
 */
export interface ActionCreationAttributes extends Optional<ActionAttributes, 'id'>  {}

/**
 * Retrieves all actions from the main process using IPC communication.
 *
 * @async
 * @function getAllActions
 * @returns {Promise<Array>} A promise that resolves to an array containing all actions.
 */
const getAllActions = async () => {
    return ipcRenderer.invoke('get-all-actions');
};

/**
 * Retrieves an action by its ID.
 *
 * @async
 * @param {number} id - The ID of the action to retrieve.
 * @returns {Promise<Object>} - A Promise that resolves to the retrieved action.
 *
 * @example
 * const actionId = 123;
 * const action = await getAction(actionId);
 * console.log(action);
 */
const getAction = async (id: number) => {
    return ipcRenderer.invoke('get-action', id);
};

/**
 * Creates an action using the provided attributes.
 * @async
 * @param {ActionCreationAttributes} action - The attributes of the action to be created.
 * @returns {Promise<any>} - A Promise that resolves with the result of the action creation.
 */
const createAction = async (action: ActionCreationAttributes) => {
    return ipcRenderer.invoke('create-action', action);
};

/**
 * Updates an action with the given ID using IPC communication.
 *
 * @param {number} id - The ID of the action to update.
 * @param {ActionCreationAttributes} action - The new attributes of the action.
 * @returns {Promise<void>} - A promise that resolves when the action is successfully updated.
 */
const updateAction = async (id: number, action: ActionCreationAttributes) => {
    await ipcRenderer.invoke('update-action', {id, action});
};

/**
 * Deletes an action with the given id by invoking the 'delete-action' IPC channel.
 * This function is asynchronous and returns a Promise.
 *
 * @param {number} id - The id of the action to be deleted.
 * @returns {Promise<void>} - A Promise that resolves once the action is deleted successfully.
 */
const deleteAction = async (id: number) => {
    await ipcRenderer.invoke('delete-action', id);
};

export { getAllActions, getAction, createAction, updateAction, deleteAction }