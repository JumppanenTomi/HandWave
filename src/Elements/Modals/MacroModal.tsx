import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState} from "react";
import Actions from "@/Actions";
import EditAction from "@/Elements/editAction";

export default function MacroModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const element = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className={"noDrag"}>
                <EditAction button actionToModify={null}/>
                <Actions/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="link" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )

    return {
        setShow,
        element
    };
};

