import {useState} from "react";
import {Form, InputGroup} from "react-bootstrap";

/**
 * Represents the properties for the Input component.
 *
 * @typedef {Object} InputProps
 * @property {string} [initial] - The initial value of the input.
 * @property {boolean} [required] - Indicates whether the input is required or not.
 * @property {string} [placeholder] - The placeholder text for the input.
 * @property {string} [unit] - The unit of measurement for the input value.
 */
type InputProps = {
    initial?: string;
    required?: boolean;
    placeholder?: string;
    unit?: string;
};

/**
 * Creates an input element with validation functionality.
 *
 * @param {string} title - The title of the input element.
 * @param {string} key - The unique key for the input element.
 * @param {InputProps} [props] - The optional input properties.
 * @returns {object} - An object with the input element and other related properties.
 */
export default function useStringInput(title: string, key: string, props?: InputProps) {
    const [value, setValue] = useState<string>(props?.initial || "");
    const [isValid, setIsValid] = useState<boolean>(true);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    const validate = (v: string) => {
        setValue(v);
        if (props?.required && v.trim().length < 3) {
            setIsValid(false);
            setValidationMessage("Value must be at least 3 characters long.");
        } else {
            setIsValid(true);
            setValidationMessage(null);
        }
    };

    const clear = () => {
        setValue(props?.initial || "");
        setIsValid(true);
        setValidationMessage(null);
    };

    const element = (
        <>
            <label>{title}</label>
            <Form.Control
                style={{backgroundColor: "none"}}
                required={props?.required || false}
                type={"text"}
                placeholder={props?.placeholder || ""}
                value={value}
                onChange={(e) => {
                    validate(e.target.value);
                }}
                isInvalid={!isValid}
            />
            {props?.unit && <InputGroup.Text>{props.unit}</InputGroup.Text>}
            {validationMessage && (
                <Form.Control.Feedback type="invalid">{validationMessage}</Form.Control.Feedback>
            )}
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
