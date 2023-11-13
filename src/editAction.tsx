import React, {useContext, useEffect, useMemo, useState} from "react";
import {
    Accordion,
    Button,
    Col,
    Container,
    InputGroup,
    Modal,
    Row,
} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenSquare, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {gestureData} from "./staticData/gestureData";
import InputsToJson from "./sharedUtilities/inputsToJson";
import useStringInput from "./useInputs/useStringInput";
import useSelectInput from "./useInputs/useSelectInput";
import {TriggerData} from "./types/TriggerData";
import {ActionType} from "./types/ActionType";
import arrayIndexAsValue from "./sharedUtilities/arrayIndexAsValue";
import {ActionsDataContext} from "./App";
import {ipcRenderer} from "electron";

//TODO: after database is done remove setTo array and finish save function
export default function EditAction({button, setToArray, actionToModify}: {
    button: boolean,
    setToArray: React.SetStateAction<any>,
    actionToModify: TriggerData | null
}) {
    const {actionData, setActionData} = useContext(ActionsDataContext)

    const [show, setShow] = useState(false);

    const [keys, setKeys] = useState<any>([{name: "undefined", value: 0}]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await ipcRenderer.invoke('getKeyboardKeys')
            setKeys(arrayIndexAsValue(result));
        };

        fetchData();
    }, [show]);

    useEffect(() => {
        console.log(keys)
    }, [keys]);


    const initialData: TriggerData = {
        id: actionData ? actionData.length + 1 : 1,
        name: "",
        trigger: "",
        actions: [],
    };

    const [data, setData] = useState<TriggerData>(actionToModify ? actionToModify : initialData);

    const keysInput = useSelectInput("Select key", "key", keys)

    const nameInput = useStringInput("Action name", "name", {
        required: true,
        initial: actionToModify ? actionToModify.name : "",
        placeholder: "For example, Change slide",
    });

    const delayInput = useStringInput("Delay", "delay", {
        placeholder: "Delay in milliseconds",
        unit: "ms",
    });

    const gestureInput = useSelectInput("Triggering gesture", "trigger", gestureData)

    const actionTypeInput = useSelectInput("Action type", "type", [{
        name: "keyboard",
        value: "keyboard"
    }, {name: "delay", value: "delay"}]);

    const addAction = () => {
        const parentJson = InputsToJson([nameInput, gestureInput]) as unknown as TriggerData;
        const actionsJson = InputsToJson([delayInput, keysInput, actionTypeInput]) as unknown as ActionType;
        switch (actionsJson.type) {
            case "keyboard":
                actionsJson.delay = undefined
                break
            case "delay":
                actionsJson.key = undefined
                break
            default:
                break
        }
        setData((prevData) => ({
            ...prevData,
            ...parentJson,
            actions: [...prevData.actions, actionsJson],
        }));
    };

    const clearInputs = () => {
        keysInput.clear()
        nameInput.clear()
        delayInput.clear()
        gestureInput.clear()
        actionTypeInput.clear()
        setData(actionToModify ? actionToModify : initialData)
    }

    const close = () => {
        setShow(false)
        clearInputs()
    };
    const open = () => setShow(true);

    const save = () => {
        if (!nameInput.value) {
            return;
        }
        setToArray((prevArray: any) => {
            if (prevArray) {
                return [...prevArray, data]
            } else {
                return [data]
            }
        })
        //TODO: add logic
        console.log(data)
        close()
    }

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
                        <InputGroup className={"formSection"}>{nameInput.element}</InputGroup>
                        <InputGroup className={"formSection"}>{gestureInput.element}</InputGroup>
                    </Container>
                    <Accordion>
                        {data.actions.map((e, i) => (
                            <Accordion.Item key={i} eventKey={String(i)}>
                                <Accordion.Header>
                                    <div className={"alignCenter"}>
                                        {e.type} {e.delay && e.delay} {e.key && e.key}
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
                            {actionTypeInput.value === "delay" && delayInput.element}
                            {actionTypeInput.value === "keyboard" && keysInput.element}
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