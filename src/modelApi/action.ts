// todo this file provides an API to interact with the db users
//todo table making it easier to work with
import {Optional} from "sequelize";
import {Action} from "@/getdb"

/**
 * Represents the attributes of an action.
 * @interface ActionAttributes
 *
 * @property {string | null} press - Represents the press attribute of the action.
 * @property {string | null} key - Represents the key attribute of the action.
 * @property {string | null} type - Represents the type attribute of the action.
 * @property {number | null} delay - Represents the delay attribute of the action.
 * @property {number | null} [gestureId] - Represents the gestureId attribute of the action.
 * @property {number | null} [id] - Represents the id attribute of the action.
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
 * Represents the attributes required for creating an Action.
 *
 * @interface ActionCreationAttributes
 * @extends Optional<ActionAttributes, 'id'>
 */
export interface ActionCreationAttributes extends Optional<ActionAttributes, 'id'>  {}

/**
 * Function that retrieves all actions by calling the "Action.findAll" method asynchronously.
 * @returns {Promise<Array>} A promise that resolves to an array of actions.
 */
const getAllActions = async () => {
    const actions = await Action.findAll()
    return actions
}

/**
 * Retrieves an action by its id
 * @async
 * @param {number} id - The id of the action to retrieve
 * @returns {Promise<Action>} The action object that matches the id
 */
const getAction = async (id: number) => {
    const action = await Action.findOne({
        where: { id: id },
        include: [{
            model: Action,
            as: 'actions' // the name of the association
        }]
    });
    return action
}

/**
 * Creates a new action in the system.
 *
 * @async
 * @param {ActionCreationAttributes} action - The action object containing the required data for creating the action.
 * @return {Promise<ActionAttributes>} - A promise that resolves to the added action object.
 */
const createAction = async (action: ActionCreationAttributes) => {
    const retData = await Action.create(action)
    const addedAction: ActionAttributes = {
        press: retData.press,
        key: retData.key,
        type: retData.type,
        delay: retData.delay,
        id: retData.id
    }
    return addedAction
}

/**
 * Updates an action with the given id.
 *
 * @param {number} id - The id of the action to update.
 * @param {ActionCreationAttributes} action - The updated data for the action.
 * @returns {Promise<void>} - A promise that resolves once the action is updated.
 */
const updateAction = async (id: number, action: ActionCreationAttributes) => {
    const a = await Action.findOne({where: {id: id}});
    if (a) {
        a.set({
            press: action.press,
            key: action.key,
            delay: action.delay,
            type: action.type
        })
        await a.save();
    }
}

/**
 * Delete an action by its id.
 *
 * @param {number} id - The id of the action to delete.
 * @returns {Promise<void>} - A promise that resolves when the action is deleted.
 */
const deleteAction = async (id: number) => {
    await Action.destroy({
        where: {
            id: id
        }
    })
}

export { getAllActions, getAction, createAction, updateAction, deleteAction }