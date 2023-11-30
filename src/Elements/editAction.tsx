import React, {useContext, useEffect, useState} from "react";
import {Accordion, Button, Col, Container, InputGroup, Modal, Row,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenSquare, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import useStringInput from "./useInputs/useStringInput";
import useSelectInput from "./useInputs/useSelectInput";
import {ipcRenderer} from "electron";
import {ActionsDataContext} from "@/App";
import arrayIndexAsValue from "@/sharedUtilities/arrayIndexAsValue";
import {gestureData} from "@/staticData/gestureData";
import useNumberInput from "@/Elements/useInputs/useNumberInput";
import InputsToJson from "@/sharedUtilities/inputsToJson";
import {TriggerData} from "@/types/TriggerData";
import {ActionType} from "@/types/ActionType";
import {createGesture, updateGesture} from "@/modelApi/gesture";

export default function EditAction({button, actionToModify}: {
    button: boolean,
    actionToModify: any | null
}) {
    const {forceRender} = useContext(ActionsDataContext);
    const [show, setShow] = useState(false);
    const [keys, setKeys] = useState<any>([{name: "undefined", value: 0}]);

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

    const mainInputs = [
        useStringInput("Action name", "name", {
            required: true,
            placeholder: "For example, Change slide",
            initial: newAction.name
        }),
        useSelectInput("Triggering gesture", "trigger", gestureData, {initial: newAction.trigger}),
    ];

    const actionTypeInput = useSelectInput("Action type", "type", [
        {name: "keyboard", value: "keyboard"},
        {name: "delay", value: "delay"},
    ]);

    const keyboardInputs = [
        useSelectInput("Press or Release", "press", [
            {name: "Press", value: true},
            {name: "Release", value: false},
        ]),
        useSelectInput("Select key", "key", keys),
    ];

    const delayInputs = [
        useNumberInput("Delay", "delay", {
            placeholder: "Delay in milliseconds",
            unit: "ms",
        }),
    ];

    const clearAll = () => {
        mainInputs.forEach((e) => e.clear());
        actionTypeInput.clear();
        keyboardInputs.forEach((e) => e.clear());
        delayInputs.forEach((e) => e.clear());
        setNewAction(actionToModify ? actionToModify : initialData);
    };

    const validateInputs = () => {
        const isValidMainInputs = mainInputs.every((input) => input.isValid);
        const isValidActionType = actionTypeInput.isValid;

        const isValidKeyboardInputs = keyboardInputs.every((input) => input.isValid);
        const isValidDelayInputs = delayInputs.every((input) => input.isValid);

        return isValidMainInputs && isValidActionType && (actionTypeInput.value === "keyboard" ? isValidKeyboardInputs : isValidDelayInputs);
    };

    const addAction = () => {
        if (!validateInputs()) {
            // Validation failed, prevent adding action
            return;
        }

        const parentJson = InputsToJson(mainInputs) as unknown as TriggerData;
        const actionsJson = InputsToJson(actionTypeInput.value === "keyboard" ? keyboardInputs : delayInputs) as unknown as ActionType;
        actionsJson.type = actionTypeInput.value as "keyboard" | "delay"

        setNewAction((prevState: { actions: any; }) => ({
            ...prevState,
            ...parentJson,
            actions: [...prevState.actions, actionsJson],
        }));
    };

    const close = () => {
        clearAll();
        setShow(false);
    };
    const open = () => setShow(true);

    const save = async () => {
        if (!validateInputs()) {
            // Validation failed, prevent saving
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

    return (
        <>
            {button ? (
                <Button variant="primary" onClick={open}>
                    Add action
                </Button>
            ) : (
                <FontAwesomeIcon icon={faPenSquare} onClick={open} className={"iconLink"}/>
            )}
            <Modal show={show} onHide={close} centered size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className={"formContainer"}>
                        {mainInputs.map((e) => (
                            <InputGroup className={"formSection"}>{e.element}</InputGroup>
                        ))}
                    </Container>
                    <Accordion>
                        {newAction.actions.map((e: { type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; delay: any; key: any; press: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => (
                            <Accordion.Item key={i} eventKey={String(i)}>
                                <Accordion.Header>
                                    <div className={"alignCenter"}>
                                        {e.type} {e.delay && e.delay} {e.key && e.key} {e.press}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col>
                                            <Button variant={"danger"}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                    <Container className={"formContainer"}>
                        <h4>Add new</h4>
                        <InputGroup className={"formSection"}>
                            {actionTypeInput.element}
                        </InputGroup>
                        <InputGroup className={"formSection"}>
                            {actionTypeInput.value === "delay" && delayInputs.map((e, i) => {
                                return e.element;
                            })}
                            {actionTypeInput.value === "keyboard" && keyboardInputs.map((e, i) => {
                                return e.element;
                            })}
                        </InputGroup>
                        <Button onClick={addAction}>
                            <FontAwesomeIcon icon={faPlus}/> Add Group
                        </Button>
                    </Container>
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
        </>
    );
}