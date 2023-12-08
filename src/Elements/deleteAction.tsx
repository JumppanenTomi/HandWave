import {useContext, useState} from "react";
import {Button, ButtonGroup, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {deleteGesture} from "@/modelApi/gesture";
import {ActionsDataContext} from "@/App";

export default function DeleteAction(action_id: number | undefined) {
    const {forceRender} = useContext(ActionsDataContext);
    const [show, setShow] = useState<boolean>(false)

    const open = () => {
        if (action_id) setShow(true)
    }
    const close = () => {
        setShow(false)
    }

    const confirm = async () => {
        if (action_id) {
            await deleteGesture(action_id);
            forceRender();
            close()
        }
    }

    const element = (
        <Modal onHide={close} show={show}>
            <Modal.Header>
                <h2>Are you sure?</h2>
            </Modal.Header>
            <Modal.Body>
                <p>Do you really want to delete action with ID: {action_id}. This cannot be reverted.</p>
            </Modal.Body>
            <Modal.Footer>
                <ButtonGroup>
                    <Button onClick={close} variant={"success"}>No</Button>
                    <Button onClick={confirm} variant={"danger"}>Yes</Button>
                </ButtonGroup>
            </Modal.Footer>
        </Modal>
    )

    return {
        element,
        open
    }
}