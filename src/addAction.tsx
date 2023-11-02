import {Accordion, Button, Col, Container, InputGroup, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import useSelectInput from "./useInputs/useSelectInput";
import useStringInput from "./useInputs/useStringInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKeyboard, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {keyData} from "./staticData/keyData";
import {gestureData} from "./staticData/gestureData";
import InputsToJson from "./sharedUtilities/inputsToJson";

export type ActionType = {
    id: number;
    type: "keyboard" | "media" | "delay";
    delay?: number;
    key?: string | number;
};

export default function AddAction() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState<ActionType[]>([]);
    const nameInput = useStringInput("Action name", "name", {required: true, placeholder: "For example. Change slide"});
    const delayInput = useStringInput("Delay", "delay", {placeholder: "Delay in milliseconds", unit: "ms"});
    const keysInput = useSelectInput("Key to press", "key", keyData.map((e) => e.key));
    const gestureInput = useSelectInput("Triggering gesture", "trigger", gestureData);
    const actionTypeInput = useSelectInput("Action type", "type", ["keyboard", "delay"]);

    const addAction = () => {
        const inputs = [delayInput, keysInput, actionTypeInput]
        const formData = InputsToJson(inputs);
        setData((prevState) => {
            const newAction = formData as unknown as ActionType;
            newAction.id = prevState ? prevState.length + 1 : 0;
            return [...(prevState || []), newAction];
        });
        inputs.map((e) => e.clear)
    };

    const updateIds = (data: ActionType[]) => {
        return data.map((action, index) => ({
            ...action,
            id: index
        }));
    };

    const deleteActionById = (id: number) => {
        setData((prevState) => {
            if (!prevState) {
                return prevState;
            }
            const updatedData = prevState.filter((action) => action.id !== id);
            return updateIds(updatedData);
        });
    };

    const close = () => setShow(false);
    const open = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={open}>
                Add action
            </Button>
            <Modal show={show} onHide={close} centered size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className={"formContainer"}>
                        <InputGroup className={"formSection"}>
                            {nameInput.element}
                        </InputGroup>
                    </Container>
                    <Accordion>
                        {data && data.map((e) => (
                            <Accordion.Item key={e.id} eventKey={String(e.id)}>
                                <Accordion.Header>
                                    <div className={"alignCenter"}>
                                        {e.type && e.type} {e.delay && e.delay} {e.key && e.key}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col>
                                            <Button variant={"danger"} onClick={() => deleteActionById(e.id)}>
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
                    <Button variant="primary" onClick={close}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}