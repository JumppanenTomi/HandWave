import React, {useState} from "react";
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
import {keyData} from "./staticData/keyData";
import {gestureData} from "./staticData/gestureData";
import InputsToJson from "./sharedUtilities/inputsToJson";
import useStringInput from "./useInputs/useStringInput";
import useSelectInput from "./useInputs/useSelectInput";
import {TriggerData} from "./types/TriggerData";
import {ActionType} from "./types/ActionType";

//TODO: after database is done remove setTo array and finish save function
export default function ModAction({button, idToUse, setToArray}: {
    button: boolean,
    idToUse: number,
    setToArray: React.SetStateAction<any>
}) {
    const [show, setShow] = useState(false);

    const initialData: TriggerData = {
        id: idToUse,
        name: "",
        trigger: "",
        actions: [],
    };

    const [data, setData] = useState<TriggerData>(initialData);

    const nameInput = useStringInput("Action name", "name", {
        required: true,
        placeholder: "For example, Change slide",
    });

    const delayInput = useStringInput("Delay", "delay", {
        placeholder: "Delay in milliseconds",
        unit: "ms",
    });

    const keysInput = useSelectInput("Key to press", "key", keyData.map((e) => e.key));

    const gestureInput = useSelectInput("Triggering gesture", "trigger", gestureData);

    const actionTypeInput = useSelectInput("Action type", "type", ["keyboard", "delay"]);

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

    const close = () => setShow(false);
    const open = () => setShow(true);

    const save = () => {
        setToArray((prevArray: any) => {
            if (prevArray){
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
                            <Accordion.Item key={i} eventKey={String(e.id)}>
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
