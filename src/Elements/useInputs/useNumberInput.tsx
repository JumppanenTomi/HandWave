import {useState} from "react";
import {Col, Form, InputGroup, Row} from "react-bootstrap";

type NumberInputProps = {
    initial?: number;
    required?: boolean;
    placeholder?: string;
    unit?: string;
    min?: number;
    max?: number;
};

export default function useNumberInput(title: string, key: string, props?: NumberInputProps) {
    const [value, setValue] = useState<number | undefined>(props?.initial);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    const validate = (v: string) => {
        const numericValue = parseFloat(v);
        setValue(isNaN(numericValue) ? undefined : numericValue);

        if (props?.required && isNaN(numericValue)) {
            setIsValid(false);
            setValidationMessage("Please enter a valid number.");
        } else if (props?.min !== undefined && numericValue < props.min) {
            setIsValid(false);
            setValidationMessage(`Value must be greater than or equal to ${props.min}.`);
        } else if (props?.max !== undefined && numericValue > props.max) {
            setIsValid(false);
            setValidationMessage(`Value must be less than or equal to ${props.max}.`);
        } else {
            setIsValid(true);
            setValidationMessage(null);
        }
    };

    const clear = () => {
        setValue(props?.initial);
        setIsValid(true);
        setValidationMessage(null);
    };

    const element = (
        <>
            <Row style={{alignItems: "center"}}>
                <Col xs={"auto"}>
                    <label>{title}</label>
                </Col>
                <Col xs={3}>
                    <Form.Control
                        required={props?.required || false}
                        type={"number"}
                        placeholder={props?.placeholder || ""}
                        value={value === undefined ? "" : value}
                        onChange={(e) => {
                            validate(e.target.value);
                        }}
                        isInvalid={!isValid}
                    />
                </Col>
                <Col xs={"auto"}>
                    {props?.unit && <label>{props.unit}</label>}
                </Col>
            </Row>
            <Row>
                <Col xs={"auto"}>
                    {validationMessage && (
                        <Form.Control.Feedback type="invalid">{validationMessage}</Form.Control.Feedback>
                    )}
                </Col>
            </Row>
        </>
    );

    return {
        element,
        value,
        clear,
        key,
        isValid,
        validationMessage,
    };
}
