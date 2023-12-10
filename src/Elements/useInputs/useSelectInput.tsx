import {useState} from "react";
import {Form} from "react-bootstrap";

/**
 * Represents the input properties for a form field.
 *
 * @typedef {Object} InputProps
 * @property {string} [initial] - The initial value for the input field.
 * @property {boolean} [required] - Indicates if the input field is required.
 */
type InputProps = {
  initial?: string;
  required?: boolean;
};

/**
 * Represents a select input type.
 *
 * @typedef {Object} SelectInputType
 * @property {string|number} name - The name of the select input type.
 * @property {*} value - The value of the select input type.
 */
export type SelectInputType = {
  name: string | number;
  value: any;
};

/**
 * Creates a select input element with validation and control functions.
 *
 * @param {string} title - The title of the select input element.
 * @param {string} key - The unique key identifier for the select input.
 * @param {SelectInputType[]} items - An array of objects representing the options for the select input.
 * @param {InputProps} [props] - Additional input properties.
 * @returns {Object} - An object containing the select input's validity, element, value, clear function, and key.
 */
export default function useSelectInput(title: string, key: string, items: SelectInputType[], props?: InputProps) {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [value, setValue] = useState<string | undefined>(props?.initial || "");

  const validate = (v: string) => {
    const isValidSelection = v !== ""; // Customize validation logic as needed

    setIsValid(isValidSelection);
    setValue(v);
  };

  const clear = () => {
    setValue(undefined);
    setIsValid(true);
  };

  const element = (
    <>
      <label>{title}</label>
      <Form.Select
        value={value}
        onChange={(e) => validate(e.target.value)}
        isInvalid={!isValid}
      >
        {!props?.required && <option value="">Select...</option>}
        {items.map((e, i) => (
          <option key={i} value={e.value}>
            {e.name}
          </option>
        ))}
      </Form.Select>
      {isValid || (
        <Form.Control.Feedback type="invalid">
          Please make a selection.
        </Form.Control.Feedback>
      )}
    </>
  );

  return {
    isValid,
    element,
    value,
    clear,
    key,
  };
}
