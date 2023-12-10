import React, {useContext, useState} from "react";
import {Button, ButtonGroup, Modal} from "react-bootstrap";
import {deleteGesture} from "@/modelApi/gesture";
import {ActionsDataContext} from "@/App";

/**
 * Deletes an action with the specified ID.
 *
 * @param {number | undefined} action_id - The ID of the action to delete.
 * @return {Object} - An object containing the element and the open function.
 */
export default function DeleteAction(action_id: number | undefined) {
  const { forceRender } = useContext(ActionsDataContext);
  const [show, setShow] = useState<boolean>(false);

  const open = () => setShow(true);
  const close = () => setShow(false);

  const confirm = async () => {
    if (action_id) {
      await deleteGesture(action_id);
      forceRender();
      close();
    }
  };

  const element = (
    <Modal onHide={close} show={show} centered>
      <Modal.Header>
        <h2>Are you sure?</h2>
      </Modal.Header>
      <Modal.Body>
        <p>
          Do you really want to delete action with ID: {action_id}. This cannot be reverted.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button onClick={close} variant={"success"}>
            No
          </Button>
          <Button onClick={confirm} variant={"danger"}>
            Yes
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );

  return {
    element,
    open,
  };
}
