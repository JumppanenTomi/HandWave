import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Col, Row} from "react-bootstrap";
import Actions from "@/Elements/Actions/Actions";
import EditAction from "@/Elements/Actions/editAction";

export default function MacroModal() {
    const [show, setShow] = useState(false);
    const addAction = EditAction(null)

    const handleClose = () => setShow(false);

    const element = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className={"noDrag"}>
                {addAction.element}
                <Row style={{height: 180}}>
                    <Col>
                        <h2>Gesture rules</h2>
                    </Col>
                    <Col xs={"auto"}>
                        <p>Add new rule <Button onClick={addAction.open}><FontAwesomeIcon icon={faPlus}/></Button></p>
                    </Col>
                    <Col xs={12} style={{textAlign: "center"}}>
                        <p>Feel free to enhance existing macros or craft new ones in this space.</p>
                    </Col>
                </Row>
                <Row>
                    <Actions/>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>
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

