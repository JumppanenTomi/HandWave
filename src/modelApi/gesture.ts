// todo this file provides an API to interact with the db users
//todo table making it easier to work with
import {Optional} from "sequelize";
import {Action, Gesture} from "../getdb"
import {createAction} from "./action";
import {ActionType} from "@/types/ActionType";

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
interface GestureCreationAttributes extends Optional<GestureAttributes, 'id'>  {}

/**
 * Retrieves all gestures from the database.
 *
 * @async
 * @function getAllGestures
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of gestures.
 *
 * @throws {Error} - If there is an error while fetching the gestures from the database.
 */
const getAllGestures = async () => {
    const gestures = await Gesture.findAll({
        include: [{
            model: Action,
            as: 'actions' // the name of the association
        }]
    })
    return gestures
}

/**
 * Retrieves a gesture by its ID.
 *
 * @param {number} id - The ID of the gesture to retrieve.
 * @returns {Promise<Gesture>} - A promise that resolves to the retrieved gesture.
 */
const getGesture = async (id: number) => {
    const gesture = await Gesture.findOne({
        where: { id: id },
        include: [{
            model: Action,
            as: 'actions' // the name of the association
        }]
    });
    return gesture
}

/**
 * Creates a new gesture with the given attributes and actions.
 * If actions are provided, it creates corresponding actions for the gesture.
 *
 * @param {GestureCreationAttributes} gesture - The attributes of the gesture to be created.
 * @param {ActionType[]} actions - The actions to be created for the gesture.
 * @returns {Promise<void>} - A promise that resolves when the gesture and actions are created successfully.
 */
const createGesture = async (gesture: GestureCreationAttributes, actions: ActionType[]) => {
    const retData = await Gesture.create(gesture)
    if (actions) {
        for (const action of actions) {
            const value = await createAction({
                ...action,
                key: String(action.key),
                delay: Number(action.delay) || null,
                gestureId: retData.id
            })
        }
    }
}

/**
 * Updates a gesture with the provided id.
 *
 * @param {number} id - The id of the gesture to update.
 * @param {GestureCreationAttributes} gesture - The updated gesture object.
 * @param {ActionType[]} actions - The actions associated with the gesture.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
const updateGesture = async (id: number, gesture: GestureCreationAttributes, actions: ActionType[]) => {
    const g = await Gesture.findOne({where: {id: id}});
    if (g) {
        g.set({
            name: gesture.name,
            trigger: gesture.trigger
        })
        await g.save();
    }

    if (actions) {
        for (const action of actions) {
            if (!action.id) {
                await createAction({
                    press: action.press,
                    type: action.type,
                    key: action.key ? String(action.key) : null,
                    delay: Number(action.delay) || null,
                    gestureId: id
                })    
            }
        }
    }
}

/**
 * Deletes a gesture from the database.
 *
 * @param {number} id - The ID of the gesture to delete.
 * @returns {Promise<void>} - A promise that resolves when the gesture is deleted.
 */
const deleteGesture = async (id: number) => {
    await Action.destroy({
        where: {
            gestureId: id
        },
    })

    await Gesture.destroy({
        where: {
            id: id
        }
    })
}

export { getAllGestures, getGesture, createGesture, updateGesture, deleteGesture }