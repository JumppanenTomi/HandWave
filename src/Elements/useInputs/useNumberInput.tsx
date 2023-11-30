import {useState} from "react";
import {Form, InputGroup} from "react-bootstrap";

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
      <InputGroup.Text>{title}</InputGroup.Text>
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
