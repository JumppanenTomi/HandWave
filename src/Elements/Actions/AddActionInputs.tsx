import React from "react";
import {Button, Col, Row} from "react-bootstrap";
import useSelectInput from "@/Elements/useInputs/useSelectInput";
import useNumberInput from "@/Elements/useInputs/useNumberInput";
import InputsToJson from "@/sharedUtilities/inputsToJson";
import {TriggerData} from "@/types/TriggerData";
import {ActionType} from "@/types/ActionType";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function AddActionInputs(keys: any, mainInputs: any[], setNewAction: any, actionToModify: any, initialData: any) {
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
        const isValidMainInputs = mainInputs.every((input) => input.value);
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
        const parentJson = InputsToJson(mainInputs) as TriggerData;
        const actionsJson = InputsToJson(actionTypeInput.value === "keyboard" ? keyboardInputs : delayInputs) as ActionType;
        actionsJson.type = actionTypeInput.value as "keyboard" | "delay"

        setNewAction((prevState: { actions: any; }) => ({
            ...prevState,
            ...parentJson,
            actions: [...prevState.actions, actionsJson],
        }));
    };

    const element = (
        <Col xs={"auto"}>
            <div className={"sourceItem"}>
                <Row>
                    <Col>
                        {actionTypeInput.element}
                        <Row>
                            {actionTypeInput.value === "delay" && (
                                <Col>
                                    {delayInputs.map(({element}, i) => element)}
                                    <Button onClick={addAction}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </Button>
                                </Col>
                            )}
                            {actionTypeInput.value === "keyboard" && (
                                <Col>
                                    {keyboardInputs.map(({element}, i) => element)}
                                    <Button onClick={addAction}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </div>
        </Col>
    );

    return {
        element,
        actionTypeInput,
        keyboardInputs,
        delayInputs,
        clearAll,
        validateInputs,
        addAction,
    };
}
