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
 * Retrieves all actions.
 *
 * @async
 * @function getAllActions
 * @returns {Promise<Array>} A promise that resolves to an array of actions.
 */
const getAllActions = async () => {
    return ipcRenderer.invoke('get-all-actions');
};

/**
 * Performs an asynchronous operation to get the action with the specified ID.
 *
 * @param {number} id - The ID of the action to retrieve.
 * @return {Promise} - A Promise that resolves with the retrieved action.
 */
const getAction = async (id: number) => {
    return ipcRenderer.invoke('get-action', id);
};

/**
 * Creates an action using the provided attributes.
 *
 * @async
 * @param {ActionCreationAttributes} action - The attributes of the action to be created.
 * @returns {Promise} - A promise that resolves with the created action.
 */
const createAction = async (action: ActionCreationAttributes) => {
    return ipcRenderer.invoke('create-action', action);
};

/**
 * Updates an action with the given id and action attributes.
 *
 * @param {number} id - The id of the action to update.
 * @param {ActionCreationAttributes} action - The updated attributes of the action.
 * @returns {Promise<void>} - A Promise that resolves when the action is successfully updated.
 */
const updateAction = async (id: number, action: ActionCreationAttributes) => {
    await ipcRenderer.invoke('update-action', {id, action});
};

/**
 * Deletes an action with the specified ID.
 *
 * @param {number} id - The ID of the action to delete.
 * @returns {Promise<void>} - A promise that resolves when the action is deleted successfully.
 */
const deleteAction = async (id: number) => {
    await ipcRenderer.invoke('delete-action', id);
};

export { getAllActions, getAction, createAction, updateAction, deleteAction }