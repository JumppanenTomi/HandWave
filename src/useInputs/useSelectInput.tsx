import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

type InputProps = {
  initial?: string;
  required?: boolean;
};

export type SelectInputType = {
  name: string | number;
  value: any;
};

export default function useSelectInput(title: string, key: string, items: SelectInputType[], props?: InputProps) {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [value, setValue] = useState<string>(props?.initial || "");

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
      <InputGroup.Text>{title}</InputGroup.Text>
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
