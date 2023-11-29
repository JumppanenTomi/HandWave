// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { Optional } from "sequelize";
import { Gesture } from "../getdb"
import { Action } from "../getdb";
import { createAction, updateAction } from "./action";
import { ActionAttributes, ActionCreationAttributes } from "./action";
import { ActionType } from "@/types/ActionType";

export interface GestureAttributes {
    name: string | null;
    trigger: string | null;
    id?: number | null;
    actions?: any[] | null;
}

interface GestureCreationAttributes extends Optional<GestureAttributes, 'id'>  {}

/** 
 * Returns all Gestures
 * @method getAllGestures
 * @returns {Array<GestureAttributes>} All Users belonging to User Model 
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
 * Returns a single gesture with its associated actions
 * @method getGesture
 * @param {number} id the gesture id
 * @returns {GestureAttributes & {actions: ActionAttributes[]}} the gesture with its associated actions
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
 * Returns all Gestures
 * @method createGesture
 * @param {NewGesture} gesture the gesture object
 * @returns {NewGesture} the created Gesture Object
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
 * Update a Gesture
 * @method updateGesture
 * @param {number} id the gesture id
 * @param {NewGesture} gesture the gesture object
 * @returns {NewGesture} the updated Gesture Object
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
 * Delete a Gesture
 * @method deleteGesture
 * @param {number} id the gesture id
 * @returns {void} 
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