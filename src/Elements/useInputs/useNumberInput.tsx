import {useState} from "react";
import {Col, Form, Row} from "react-bootstrap";

/**
 * Represents the properties for a NumberInput component.
 * @typedef {Object} NumberInputProps
 * @property {number} [initial] - The initial value for the NumberInput.
 * @property {boolean} [required] - Specifies if the NumberInput is required.
 * @property {string} [placeholder] - The placeholder text for the NumberInput.
 * @property {string} [unit] - The unit of measurement for the NumberInput.
 * @property {number} [min] - The minimum value allowed for the NumberInput.
 * @property {number} [max] - The maximum value allowed for the NumberInput.
 */
type NumberInputProps = {
    initial?: number;
    required?: boolean;
    placeholder?: string;
    unit?: string;
    min?: number;
    max?: number;
};

/**
 * Creates a number input element with validation and utility methods.
 *
 * @param {string} title - The title or label for the number input.
 * @param {string} key - The unique key identifier for the number input.
 * @param {Object} props - Additional properties for the number input.
 * @param {number} props.initial - The initial value for the number input.
 * @param {boolean} props.required - Whether the number input is required.
 * @param {number} props.min - The minimum value allowed for the number input.
 * @param {number} props.max - The maximum value allowed for the number input.
 * @param {string} props.placeholder - The placeholder text for the number input.
 * @param {string} props.unit - The unit of measurement for the number input.
 *
 * @return {Object} - An object containing the number input element, value, clear method, key,
 *   validity flag, and validation message.
 */
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
