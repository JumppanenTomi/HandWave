import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useContext, useEffect, useState} from "react";
import useCheckboxInput from "@/Elements/useInputs/useCheckBoxInput";
import {FaceDetectionContext, MeshContext} from "@/App";

/**
 * Represents a modal component for face detection settings.
 *
 * @returns {Object} An object with setShow function and element component.
 */
export default function FaceDetectionSettingsModal() {
    const {faceDetection, setFaceDetection} = useContext(FaceDetectionContext)
    const {mesh, setMesh} = useContext(MeshContext)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const faceMeshInput = useCheckboxInput("Use camera overlay", "overlay", mesh)
    const faceDetectionInput = useCheckboxInput("Use facedetection to prevent unintended keystrokes and mouse movement", "facemesh", faceDetection)

    useEffect(() => {
        setFaceDetection(faceDetectionInput.checkedValue)
        setMesh(faceMeshInput.checkedValue)
    }, [faceMeshInput.checkedValue, faceDetectionInput.checkedValue]);

    const element = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className={"noDrag"}>
                <h2>Mesh settings</h2>
                {faceMeshInput.element}
                <h2>Face detection settings</h2>
                {faceDetectionInput.element}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )

    return {
        setShow,
        element
    }
};

