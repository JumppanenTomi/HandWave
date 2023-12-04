// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { Optional } from "sequelize";
import { Action } from "@/getdb"

export interface ActionAttributes {
    press: string | null;
    key: string | null;
    type: string | null;
    delay: number | null;
    gestureId?: number | null;
    id?: number | null;
}

export interface ActionCreationAttributes extends Optional<ActionAttributes, 'id'>  {}

/** 
 * Returns all Actions
 * @method getAllActions
 * @returns {Array<ActionAttributes>} All Users belonging to User Model 
*/
const getAllActions = async () => {
    const actions = await Action.findAll()
    return actions
}

/**
 * Returns a single action with its associated actions
 * @method getAction
 * @param {number} id the action id
 * @returns {ActionAttributes & {actions: ActionAttributes[]}} the action with its associated actions
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
 * Returns all Actions
 * @method createAction
 * @param {NewAction} action the action object
 * @returns {NewAction} the created Action Object
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
 * Update a Action
 * @method updateAction
 * @param {number} id the action id
 * @param {NewAction} action the action object
 * @returns {NewAction} the updated Action Object
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
 * Delete a Action
 * @method deleteAction
 * @param {number} id the action id
 * @returns {void} 
*/
const deleteAction = async (id: number) => {
    await Action.destroy({
        where: {
            id: id
        }
    })
}

export { getAllActions, getAction, createAction, updateAction, deleteAction }