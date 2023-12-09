import React, {useContext, useEffect, useState} from "react";
import {Accordion, Button, Col, Modal, Row,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import useStringInput from "../useInputs/useStringInput";
import useSelectInput from "../useInputs/useSelectInput";
import {ipcRenderer} from "electron";
import {ActionsDataContext} from "@/App";
import arrayIndexAsValue from "@/sharedUtilities/arrayIndexAsValue";
import {gestureData} from "@/staticData/gestureData";
import InputsToJson from "@/sharedUtilities/inputsToJson";
import {TriggerData} from "@/types/TriggerData";
import {ActionType} from "@/types/ActionType";
import {createGesture, updateGesture} from "@/modelApi/gesture";
import DeleteAction from "./deleteAction";
import {faPlay} from "@fortawesome/free-solid-svg-icons/faPlay";
import {faFlagCheckered} from "@fortawesome/free-solid-svg-icons/faFlagCheckered";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";
import AddActionInputs from "./AddActionInputs";
import EventItem from "@/Elements/Actions/EventItem";

export default function EditAction(actionToModify: any | null) {
    const {forceRender} = useContext(ActionsDataContext);
    const [show, setShow] = useState(false);
    const [keys, setKeys] = useState<any>([{name: "undefined", value: 0}]);

    console.log(actionToModify)
    useEffect(() => {
        const fetchData = async () => {
            const result = await ipcRenderer.invoke('getKeyboardKeys');
            setKeys(arrayIndexAsValue(result));
        };
        fetchData();
    }, [show]);

    const initialData = {
        name: "",
        trigger: "",
        actions: [],
    };

    const [newAction, setNewAction] = useState(actionToModify ? actionToModify : initialData);

    const deleteRule = DeleteAction(newAction.id)

    const mainInputs = [
        useStringInput("Action name", "name", {
            required: true,
            placeholder: "For example, Change slide",
            initial: newAction.name
        }),
        useSelectInput("Triggering gesture", "trigger", gestureData, {initial: newAction.trigger}),
    ];

    const addActionsInputs = AddActionInputs(keys, mainInputs, setNewAction, actionToModify, initialData)

    const close = () => {
        addActionsInputs.clearAll();
        setShow(false);
    };
    const open = () => setShow(true);

    const save = async () => {
        if (!addActionsInputs.validateInputs()) {
            return;
        }
        const parentJson = InputsToJson(mainInputs) as unknown as TriggerData;
        setNewAction((prevState: any) => ({
            ...prevState,
            ...parentJson
        }));

        if (!newAction.id) {
            await createGesture({
                name: newAction.name,
                trigger: newAction.trigger,
            }, newAction.actions)

        } else {
            await updateGesture(newAction.id, {
                name: newAction.name,
                trigger: newAction.trigger,
            }, newAction.actions)
        }

        forceRender();
        close();
    };

    const element = (
        <Modal show={show} onHide={close} size={"lg"} centered>
            {deleteRule.element}
            <Modal.Header>
                <Row style={{width: "100%", alignItems: "center"}}>
                    <Col>
                        <Row>
                            {mainInputs.map((e) => (
                                <Col xs={6}>{e.element}</Col>
                            ))}
                        </Row>
                    </Col>
                    <Col xs={"auto"}>
                        {newAction.id && (
                            <Button onClick={deleteRule.open} variant={"danger"}><FontAwesomeIcon
                                icon={faTrash}/></Button>
                        )}
                    </Col>
                </Row>
            </Modal.Header>
            <Modal.Body>
                <Accordion>
                    <Row style={{alignItems: "center", marginLeft: 20, marginRight: 20}}>
                        <Col xs={"auto"} className={"badgeRow"}>
                            <FontAwesomeIcon icon={faPlay} size={"2xl"}/>
                        </Col>
                        {newAction.actions && newAction.actions.map((e: ActionType, i: number) => (
                                <>
                                    <EventItem item={e} key={i} />
                                    {i < newAction.actions.length - 1 && (
                                        <Col xs={"auto"} className={"badgeRow"}>
                                            <FontAwesomeIcon icon={faArrowRight}/>
                                        </Col>
                                    )}
                                </>
                            )
                        )}
                        {addActionsInputs.element}
                        <Col xs={"auto"} className={"badgeRow"}>
                            <FontAwesomeIcon icon={faFlagCheckered} size={"2xl"}/>
                        </Col>
                    </Row>
                </Accordion>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Close
                </Button>
                <Button variant="primary" onClick={save}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )

    return {
        element,
        open
    }
}